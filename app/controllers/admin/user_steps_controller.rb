class Admin::UserStepsController < AdminController
  include Wicked::Wizard
  include NavigationHelper

  steps *User.form_steps[:pages]
  attr_accessor :steps_names
  helper_method :disable_button?
  helper_method :active_button?

  before_action :set_current_user, only: [:show, :update]
  before_action :get_user_pages
  before_action :set_breadcrumbs, only: [:show, :update]
  prepend_before_action :ensure_session_keys_exist, only: [:new, :edit, :show, :update]

  SAVE = 'Save'.freeze
  CONTINUE = 'Continue'.freeze


  # This action cleans the session
  def new
    reset_session_key(:user, @user_id, {})
    redirect_to admin_user_step_path(id: Wicked::FIRST_STEP)
  end

  # This action clean the session
  def edit
    reset_session_key(:user, @user_id, {})
    redirect_to wizard_path(Wicked::FIRST_STEP)
  end

  def show
    if step == 'sites' && @user.admin
      redirect_to next_wizard_path
      return
    end
    render_wizard
  end

  def update
    @user.form_step = step
    if @user.valid?
      if step == 'sites' && @user.admin # If the user is an admin
        redirect_to wizard_path(wizard_steps[3])
      elsif step == 'contexts'
        url = @user.admin ? admin_sites_url : management_url
        api_response = @user.send_to_api(session[:user_token], url)
        if api_response[:valid]
          @user.save
          delete_session_key(:user, @user_id)
          redirect_to next_wizard_path, notice: 'User was successfully created. Please check your email to login.'
        else
          @user.errors['id'] << 'API error: ' + api_response[:error].to_s
          render_wizard
        end
      else
        redirect_to next_wizard_path
      end
    else
      render_wizard
    end
  end

  private
  def user_params
    params.require(:user).permit(:name, :email, :admin, site_ids: [], context_ids: [])
  end

  def set_current_user
    @user = params[:user_id] ? User.find(params[:user_id]) : User.new
    @user_id = if @user && @user.persisted?
      @user.id
    else
      :new
    end
    session[:user][@user_id] ||= {}
    session[:user][@user_id].merge!(user_params.to_h) if params[:user] && user_params.to_h
    @user.assign_attributes session[:user][@user_id] if session[:user][@user_id]
  end

  def get_user_pages
    self.steps_names = *User.form_steps[:names]
  end

  # Defines the path the wizard will go when finished
  def finish_wizard_path
    admin_users_path
  end

  def set_breadcrumbs
    if @user.id
      @breadcrumbs << {name: "Editing user \"#{@user.name}\""}
    else
      @breadcrumbs << {name: 'New User'}
    end
  end

  def ensure_session_keys_exist
    session[:user] ||= {}
  end
end
