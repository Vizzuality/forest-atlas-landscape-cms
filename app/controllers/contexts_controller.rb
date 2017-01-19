class ContextsController < ManagementController
  before_action :get_contexts, only: :index

  def index
    gon.contexts = @contexts
  end

  def destroy

  end

  private
  def context_param
    params.require(:context).permit(:id)
  end

  def get_contexts
    @contexts = current_user.get_contexts
  end
end
