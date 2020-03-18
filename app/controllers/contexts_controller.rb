class ContextsController < ManagementController
  before_action :ensure_admin_user
  before_action :get_contexts, only: :index

  def index
    gon.contexts = @gon_contexts
  end

  def destroy
    context = Context.find(params[:id])
    context.destroy
    redirect_to contexts_path, notice: 'Context was successfully destroyed.'
  end

  private

  def ensure_admin_user
    ensure_user_can 'access_admin_only'
  end

  def context_param
    params.require(:context).permit(:id)
  end

  def get_contexts
    @contexts = current_user.get_contexts(true)
    @gon_contexts = []

    @contexts.each do |context|
      datasets_api = DatasetService.get_metadata_list(
        context.context_datasets.map(&:dataset_id)
      )
      unless datasets_api.blank? || datasets_api['data'].blank?
        datasets = datasets_api['data'].map { |d| d.dig('attributes', 'name') }
      end

      gon_context = {
        'name' => {'value' => context.name, 'searchable' => true, 'sortable' => true},
        'sites' => {'value' => context.sites.map(&:name), 'searchable' => true, 'sortable' => true},
        'datasets' => {'value' => datasets, 'searchable' => true, 'sortable' => true},
        'owners' => {'value' => context.owners.map(&:name).uniq, 'searchable' => true, 'sortable' => true},
        'writers' => {'value' => context.writers.map(&:name).uniq, 'searchable' => true, 'sortable' => true},
        'edit' => {'value' => edit_link(context), 'method' => 'get'},
        'delete' => {'value' => delete_link(context), 'method' => 'delete'}
      }

      @gon_contexts << gon_context
    end
  end

  def edit_link(context)
    return unless context.owners.include?(current_user) || current_user.admin

    edit_context_context_step_path(id: 'title', context_id: context.id)
  end

  def delete_link(context)
    return unless context.owners.include?(current_user) || current_user.admin

    context_path(context.id)
  end
end
