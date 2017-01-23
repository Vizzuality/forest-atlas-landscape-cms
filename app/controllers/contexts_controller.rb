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

      gon_context = {
        'name' => {'value' => context.name, 'searchable' => true, 'sortable' => true},
        'sites' => {'value' => context.sites.map{|s| s.name}, 'searchable' => true, 'sortable' => true},
        'owners' =>  {'value' => context.owners.map{|o| o.name}, 'searchable' => true, 'sortable' => true},
        'writers' => {'value' => context.writers.map{|w| w.name}, 'searchable' => true, 'sortable' => true},
        'edit' => {'value' => edit_link, 'method' => 'get'},
        'delete' => {'value' => edit_link, 'method' => 'delete'}
      }

      @gon_contexts << gon_context
    end

  end
end
