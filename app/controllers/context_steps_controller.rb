class ContextStepsController < ManagementController
  include Wicked::Wizard

  before_action :steps_names
  before_action :build_context
  before_action :check_user_permissions
  before_action :reset_session, only: [:new, :edit]
  before_action :build_context, only: [:update, :show]
  before_action :save_context, only: :update
  before_action :build_steps_data, only: [:update, :show]

  steps *Context.form_steps[:pages]
  attr_accessor :steps_names

  CONTINUE = 'CONTINUE'.freeze
  SAVE = 'SAVE CHANGES'.freeze

  # Reset the session
  def new
    redirect_to context_step_path(id: wizard_steps[0])
  end

  # Reset the session
  def edit
    redirect_to context_context_step_path(id: wizard_steps[0], context_id: params[:context_id])
  end

  def show
    render_wizard
  end

  def update
    move_forward
  end

  private
  def context_params
    params.require(:context).permit(:id, :name, dataset_ids: [], user_ids: [], site_ids: [] )
  end

  def reset_context
    session[:context] = {}
  end

  def build_context
    if params[:context_id]
      @context = Context.find(params[:context_id])
    else
      @context = Context.new
    end
    @context.form_step = step
    @context.assign_attributes session[:context] if session[:context]
    @context.assign_attributes context_params if params[:context]
  end

  def save_context
    session[:context] = @context.attributes
  end

  def steps_names
    self.steps_names = *Context.form_steps[:names]
  end

  def check_user_permissions
    @current_user = current_user
    return if @current_user.admin
    if @context.id
      unless @context.context_owners.include? @current_user
        redirect_to context_path, notice: 'You do not have permissions to edit this context'
      end
    end
  end

  def save_button?
    return false unless params[:button]
    return params[:button].upcase == SAVE.upcase
  end

  # Saves the current state and goes to the next step
  # Params:
  # +next_step_name+:: Next step on pressing continue
  # +save_step_name+:: Next step on pressing save
  def move_forward(next_step_name = next_step,
                   save_step_name = Wicked::FINISH_STEP)

    if save_button?
      notice_text = @page.id ? 'saved' : 'created'
      if @context.save
        redirect_to wizard_path(save_step_name), notice: 'Context successfully ' + notice_text
      else
        render_wizard
      end
    else # Continue button
      if @context.valid?
        redirect_to wizard_path(next_step_name)
      else
        render_wizard
      end
    end
  end

  # Creates a list of sites available for that user
  def permitted_sites
    @permitted_sites =
      if @current_user.admin
        Site.all
      else
        @current_user.sites
      end
  end

  # Created a list of users that are not admins
  def permitted_users
    @permitted_users = User.where(admin: false)
  end

  def build_steps_data
    permitted_sites if step == 'sites'
    permitted_users if step == 'users'
  end
end
