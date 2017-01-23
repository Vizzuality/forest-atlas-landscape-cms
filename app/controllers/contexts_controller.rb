class ContextsController < ManagementController
  before_action :get_contexts, only: :index

  def index
    gon.contexts = @gon_contexts
  end

  def destroy

  end

  private
  def context_param
    params.require(:context).permit(:id)
  end

  def get_contexts
    @contexts = current_user.get_contexts(true)
    @gon_contexts = []

    @contexts.each do |context|
      edit_link = context.owners.include?(current_user) || current_user.admin ? \
            context_path(context.id) : nil
      gon_context =
        { name: context.name,
          sites: context.sites.map{|s| s.name}.join(','),
          owners: context.owners.map{|o| o.name}.join(','),
          writers: context.writers.map{|w| w.name}.join(','),
          delete_link: edit_link,
          edit_link: edit_link
        }
        @gon_contexts << gon_context
    end

  end
end
