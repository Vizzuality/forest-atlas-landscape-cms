class Management::UsersController < ManagementController
  before_action :load_site
  before_action :authorize, only: %i[index update]

  def new
    @user = User.new
    @usa = @user.user_site_associations.build(site: @site, role: UserType::PUBLISHER)
  end

  def create
    email = user_params[:email]
    role = user_params[:site_role]
    @user = User.find_by_email(email) if email.present?
    if @user
      grant_access(role)
    else
      create_and_grant_access(role)
    end
  end

  def index
    @user_sites = @site.user_site_associations
  end

  def update

  end

  private

  def authorize
    unless user_site_manager?(@site)
      flash[:error] = 'You do not have permissions to view this page'
      redirect_to :no_permissions
    end
  end

  def user_params
    params.require(:user).permit(
      :name,
      :email,
      :site_role
    )
  end

  def load_site
    @site = Site.find_by(slug: params[:site_slug])
  end

  def grant_access(role)
    @usa = @user.user_site_associations.find_by_site_id(@site.id)
    if @usa
      @usa.role = role unless @usa.role == UserType::MANAGER
    else
      @usa = @user.user_site_associations.build(site: @site, role: role)
    end
    if @user.save
      redirect_to management_site_site_pages_url, notice: 'User was successfully granted access.'
    else
      render :new
    end
  end

  def create_and_grant_access(role)
    @user = User.new(user_params.except(:site_role))
    @usa = @user.user_site_associations.build(site: @site, role: role)
    if @user.valid?
      api_response = @user.send_to_api(session[:user_token], management_url)
      if api_response[:valid]
        @user.save
        redirect_to management_site_site_pages_url, notice: 'User was successfully created.'
      else
        @user.errors['id'] << 'API error: ' + api_response[:error].to_s
        render :new
      end
    else
      render :new
    end
  end
end
