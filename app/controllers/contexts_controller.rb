class ContextsController < ManagementController
  before_action :get_contexts, only: :index

  def index
    gon.contexts = @gon_contexts
  end

  def destroy
    context = Context.find(params[:id])
    context.destroy
    redirect_to contexts_path, notice: 'Context successfully removed'
  end

  private
  def context_param
    params.require(:context).permit(:id)
  end

  def get_contexts
    @contexts = current_user.get_contexts(true)
    @gon_contexts = []

    @contexts.each do |context|
      delete_link = context.owners.include?(current_user) || current_user.admin ? \
            context_path(context.id) : nil
      edit_link = context.owners.include?(current_user) || current_user.admin ? \
            edit_context_context_step_path(id: 'title', context_id: context.id) : nil
      datasets_api = DatasetService.get_metadata_list context.context_datasets.map{|cd| cd.dataset_id}
      datasets = datasets_api['data'].map{|d| d.dig('attributes', 'name')}.join(', ') \
          unless datasets_api.blank? || datasets_api['data'].blank?

      gon_context = {
        'name' => {'value' => context.name, 'searchable' => true, 'sortable' => true},
        'sites' => {'value' => context.sites.map{|s| s.name}, 'searchable' => true, 'sortable' => true},
        'datasets' => {'value' => datasets, 'searchable' => true, 'sortable' => true},
        'owners' =>  {'value' => context.owners.map{|o| o.name}, 'searchable' => true, 'sortable' => true},
        'writers' => {'value' => context.writers.map{|w| w.name}, 'searchable' => true, 'sortable' => true},
        'edit' => {'value' => edit_link, 'method' => 'get'},
        'delete' => {'value' => delete_link, 'method' => 'delete'}
      }

      @gon_contexts << gon_context
    end

  end
end
