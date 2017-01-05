class Admin::UserStepsController < AdminController
  include Wicked::Wizard
  include NavigationHelper

  steps *User.form_steps[:pages]
  attr_accessor :steps_names
  helper_method :disable_button?
  helper_method :active_button?

  before_action :set_current_user
  before_action :get_user_pages

  SAVE = 'Save Changes'.freeze
  CONTINUE = 'Continue'.freeze


  # This action cleans the session
  def new
    session[:user] = {}
    redirect_to admin_user_step_path(id: Wicked::FIRST_STEP)
  end

  # This action clean the session
  def edit
    session[:user] = {}
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
        api_response = @user.send_to_api(session[:user_token])
        if api_response[:valid]
          @user.save
          redirect_to next_wizard_path
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
    session[:user].merge!(user_params.to_h) if params[:user] && user_params.to_h
    @user.assign_attributes session[:user] if session[:user]
  end

  def get_user_pages
    self.steps_names = *User.form_steps[:names]
  end

  # Defines the path the wizard will go when finished
  def finish_wizard_path
    admin_users_path
  end

end
