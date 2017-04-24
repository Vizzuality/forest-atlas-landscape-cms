class Management::ContextsController < ManagementController
  before_action :ensure_management_user, only: :destroy
  before_action :set_site, only: [:index, :new, :create]
  before_action :get_contexts, only: :index
  before_action :set_dataset, only: [:edit, :destroy]

  # Validate if user can modify the dataset
  before_action :authenticate_user_for_site!

  def index
    gon.contexts = @gon_contexts
  end

  def destroy
    context = Context.find(params[:id])
    context.destroy
    redirect_to controller: 'management/contexts', action: 'index', site_slug: @site.slug, notice: 'Context was successfully destroyed.'
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_site
    @site = Site.find_by({slug: params[:site_slug]})

    if (@site.routes.any?)
      # We just want a valid URL for the site
      @url = @site.routes.first.host_with_scheme
    end
  end

  def context_param
    params.require(:context).permit(:id)
  end

  def get_contexts
    # TODO: This would be better if fetched + filtered in the database.
    @contexts = current_user.get_contexts(true).select { |context| context.sites.include?(@site) }
    @gon_contexts = []

    @contexts.map do |context|
      delete_link = context.owners.include?(current_user) || current_user.admin ? \
            context_path(context.id) : nil
      edit_link = context.owners.include?(current_user) || current_user.admin ? \
            edit_context_context_step_path(id: 'title', context_id: context.id) : nil
      datasets_api = DatasetService.get_metadata_list context.context_datasets.map{|cd| cd.dataset_id}
      datasets = datasets_api['data'].map{|d| d.dig('attributes', 'name')} \
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
