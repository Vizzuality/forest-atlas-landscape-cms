class ContextStepsController < ManagementController
  include Wicked::Wizard

  before_action :steps_names
  before_action :build_context
  before_action :check_user_permissions, only: [:update, :show]
  before_action :build_steps_data, only: [:update, :show]
  prepend_before_action :ensure_session_keys_exist, only: [:new, :edit, :show, :update]

  steps *Context.form_steps[:pages]
  attr_accessor :steps_names

  CONTINUE = 'CONTINUE'.freeze
  SAVE = 'SAVE'.freeze

  # Reset the session
  def new
    @context_id = :new
    reset_session_key(:context, @context_id, {})
    redirect_to context_step_path(id: wizard_steps[0])
  end

  # Reset the session
  def edit
    @context_id = @context.id
    reset_session_key(:context, @context_id, {})
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
    params.require(:context).permit(:id, :name, dataset_ids: [], writer_ids:[], owner_ids:[], site_ids: [] )
  end

  def build_context
    @context = params[:context_id] ? Context.find(params[:context_id]) : Context.new
    @context_id = if @context && @context.persisted?
      @context.id
    else
      :new
    end
    session[:context][@context_id] ||= {}
    session[:context][@context_id].merge!(context_params.to_h.except('dataset_ids')) if params[:context] && context_params.to_h.except('dataset_ids')

    if params[:context] && context_params['dataset_ids']
      session[:context][@context_id]['context_datasets'] = []
      context_params['dataset_ids'].each do |dataset_id|
        # TODO: This has to be done in another way
        session[:context][@context_id]['context_datasets'] << ContextDataset.new(dataset_id: dataset_id)
      end
    end

    @context.assign_attributes session[:context][@context_id] if session[:context][@context_id]
    @context.form_step = step


=begin

    if params[:context_id]
      @context = Context.find(params[:context_id])
    else
      @context = Context.new
    end
    @context.form_step = step
    @context = session[:context] if session[:context]

    # To guarantee that changing the owners, the writers are not duplicated
    if params[:context] && context_params['owners']
      context_params['owners'].each do |owner|
        @context.writers.delete_if{|w| w.id == owner}
      end
    end

    if params[:context] && context_params['name']
      @context.name = context_params['name']
    end
    if params[:context] && context_params['dataset_ids']
      context_params['dataset_ids'].each do |dataset_id|
        # TODO: This has to be done in another way
        @context.context_datasets << ContextDataset.new(dataset_id: dataset_id)
      end
    end
    if params[:context] && context_params['site_ids']
      @context.site_ids = context_params['site_ids']
    end
    if params[:context] && context_params['owner_ids']
      @context.owner_ids = context_params['owner_ids']
    end
    if params[:context] && context_params['writer_ids']
      @context.writer_ids = context_params['writer_ids']
    end
    #@context.assign_attributes context_params.except('dataset_ids') if params[:context]
=end
  end

  def save_context
    session[:context][@context_id] = @context
  end

  def steps_names
    self.steps_names = *Context.form_steps[:names]
  end

  def check_user_permissions
    @current_user = current_user
    return if @current_user.admin
    if @context.id
      unless @context.context_owners.include? @current_user
        redirect_to contexts_path, notice: 'You do not have permissions to edit this context'
        return
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
      notice_text = @context.id ? 'saved' : 'created'
      if @context.save
        delete_session_key(:context, @context_id)
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

  # Defines the path the wizard will go when finished
  def finish_wizard_path
    contexts_path
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
  def permitted_owners
    @permitted_owners = User.where(admin: false)
  end

  def permitted_writers
    permitted_users = User.where(admin: false)
    @permitted_writers = permitted_users.to_a.delete_if{|user| @context.owners.include?(user)}
  end

  def get_datasets
    @datasets = DatasetService.get_datasets
  end

  def build_steps_data
    permitted_sites if step == 'sites'
    permitted_owners if step == 'owners'
    permitted_writers if step == 'writers'
    get_datasets if step == 'datasets'
  end

  def ensure_session_keys_exist
    session[:context] ||= {}
  end
end
