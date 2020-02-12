class Management::DatasetsController < ManagementController
  before_action :set_site, only: [:index, :new, :create, :destroy]
  before_action :ensure_management_user, only: [:destroy]
  before_action :set_datasets, only: :index
  before_action :set_dataset, only: [:edit, :destroy]

  # Validate if user can modify the dataset
  before_action :authenticate_user_for_site!

  def index
    @dataset_metadata = Dataset.get_metadata_list_for_frontend(session[:user_token], @datasets.map(&:id))

    @filteredDatasets = []

    @datasets.each do |dataset|
      @filteredDatasets.push renderable_dataset(dataset)

      # Untill we remove backbone, we need to keep this
      gon.datasets = @filteredDatasets
    end
  end

  def destroy
    response = DatasetService.delete(session[:user_token], params[:id])

    flash[response[:valid] ? :notice : :error] = response[:message]

    render :index
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

  # Gets a dataset from the API and sets it to the member variable
  def set_dataset
    # TODO
    #@dataset = DatasetService.get_dataset
  end

  # TODO: Use cache for this
  # Gets the datasets from the API and sets them to the member variable
  def set_datasets
    datasets = @site.get_datasets(current_user)
    @datasets = process_datasets datasets
  end

  def process_datasets(datasets)
    datasets.map do |dataset|
      dataset_info = DatasetService.get_metadata(dataset.id)['data']

      dataset_info['attributes']['widget'] =
        (dataset_info['attributes']['widget'] || []).map { |widget| widget['attributes']['name'] }

      user_email = dataset_info.dig('attributes', 'user', 'email')
      if user_email
        user = User.find_by(email: user_email)
        dataset_info['attributes']['user'] = user.name
      else
        dataset_info['attributes']['user'] = nil
      end

      Dataset.new dataset_info
    end
  end

  def renderable_dataset(dataset)
    processed_dataset = {
      'title' => {'value' => dataset.name, 'searchable' => true, 'sortable' => true},
      'contexts' => {'value' => ContextDataset.where(dataset_id: dataset.id).map{|ds| ds.context.name}.join(', '), 'searchable' => true, 'sortable' => false},
      'connector' => {'value' => dataset.provider, 'searchable' => true, 'sortable' => true},
      'status' => {'value' => dataset.status, 'searchable' => true, 'sortable' => true},
      'metadata' => {'value' => @dataset_metadata[dataset.id], 'searchable' => false, 'sortable' => false, 'visible' => false},
      'owner' => {'value' => dataset.user, 'searchable' => true, 'sortable' => true},
      'created' => {'value' => DateTime.parse(dataset.created_at).strftime('%d/%m/%Y %T'), 'searchable' => true, 'sortable' => true},
      'edited' => {'value' => DateTime.parse(dataset.updated_at).strftime('%d/%m/%Y %T'), 'searchable' => true, 'sortable' => true},
      'widgets' => {'value' => (dataset.widgets || []).join(', ')},
      'edit' => {'value' => edit_management_site_dataset_dataset_step_path(@site.slug, dataset.id, id: :metadata), 'method' => 'get'}
    }
    if delete_url(dataset.id)
      processed_dataset['delete'] =
        {'value' => delete_url(dataset.id), 'method' => 'delete'}
    end
    processed_dataset
  end

  # Only shows the delete url in case the user is a site admin for this site
  def delete_url(dataset_id)
    return unless current_user_is_admin ||
      current_user.owned_sites.include?(@site)

    management_site_dataset_path(
      params[:site_slug],
      dataset_id,
      action: :delete
    )
  end
end
