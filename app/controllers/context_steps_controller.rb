class ContextStepsController < ManagementController
  include Wicked::Wizard

  steps *Context.form_steps[:pages]
  attr_accessor :steps_names

  # Reset the session
  def new

  end

  # Reset the session
  def edit

  end

  def show

  end

  def update

  end

  private
  def context_params
    params.require(:context).permit(:id, dataset_ids: [], user_ids: [], site_ids: [] )
  end

  def build_context
    @context = Context.new
  end
end
