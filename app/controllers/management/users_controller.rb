class Management::UsersController < ManagementController
  before_action :load_site

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

  private

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
      @usa.role = role unless @usa.role == UserType::ADMIN
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
    if @user.valid?
      api_response = @user.send_to_api(session[:user_token], management_url)
      if api_response[:valid]
        @user.save
        @usa = @user.user_site_associations.build(site: @site, role: role).save
        redirect_to management_site_site_pages_url, notice: 'User was successfully created.'
      else
        @usa = @user.user_site_associations.build(site: @site, role: role)
        @user.errors['id'] << 'API error: ' + api_response[:error].to_s
        render :new
      end
    else
      @usa = @user.user_site_associations.build(site: @site, role: role)
      render :new
    end
  end
end
