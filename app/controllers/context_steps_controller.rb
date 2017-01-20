class ContextStepsController < ManagementController
  include Wicked::Wizard

  before_action :build_context
  before_action :steps_names

  steps *Context.form_steps[:pages]
  attr_accessor :steps_names

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
    if @context.valid?
      redirect_to next_wizard_path
    else
      render_wizard
    end
  end

  private
  def context_params
    params.require(:context).permit(:id, dataset_ids: [], user_ids: [], site_ids: [] )
  end

  def build_context
    @context = Context.new
  end

  def steps_names
    self.steps_names = *Context.form_steps[:names]
  end
end
