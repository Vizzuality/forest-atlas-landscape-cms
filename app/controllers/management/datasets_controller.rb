class Management::DatasetsController < ManagementController
  before_action :set_site, only: [:index, :new, :create, :destroy]
  before_action :set_datasets, only: :index
  before_action :set_dataset, only: [:edit, :destroy]

  # Validate if user can modify the dataset
  before_action :authenticate_user_for_site!

  def index
    datasets_metadata = Dataset.get_metadata_list_for_frontend(
      user_token(@site),
      @datasets.map(&:id)
    )

    processed_datasets = []
    @datasets.each do |dataset|
      processed_datasets.push renderable_dataset(dataset, datasets_metadata)

      # Untill we remove backbone, we need to keep this
      gon.datasets = processed_datasets
    end
    @filtered_datasets = processed_datasets
  end

  def destroy
    response = DatasetService.delete(
      user_token(@site, current_user.email == @dataset.user&.dig('email')),
      params[:id]
    )

    flash[response[:valid] ? :notice : :error] = response[:message]

    redirect_to management_site_datasets_path(site_slug: @site.slug)
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_site
    @site = Site.find_by(slug: params[:site_slug])

    # We just want a valid URL for the site
    @url = @site.routes.first.host_with_scheme if @site.routes.any?
  end

  # Gets a dataset from the API and sets it to the member variable
  def set_dataset
    @dataset =
      Dataset.find_with_metadata(params[:id], user_token(@site, true))
  end

  # TODO: Use cache for this
  # Gets the datasets from the API and sets them to the member variable
  def set_datasets
    # Force admin token for getting user information (show/hide delete button)
    datasets = @site.get_datasets(current_user)
    @datasets = process_datasets datasets
  end

  def process_datasets(datasets)
    datasets.map do |dataset|
      dataset_info = DatasetService.get_metadata(
        dataset.id,
        user_token(@site, true)
      )['data'].first

      dataset_info['attributes']['widget'] =
        (dataset_info['attributes']['widget'] || []).map { |widget| widget['attributes']['name'] }

      Dataset.new dataset_info
    end
  end

  def renderable_dataset(dataset, datasets_metadata)
    processed_dataset = {
      'title' => {'value' => dataset.name, 'searchable' => true, 'sortable' => true},
      'contexts' => {'value' => ContextDataset.where(dataset_id: dataset.id).map{|ds| ds.context.name}.join(', '), 'searchable' => true, 'sortable' => false},
      'connector' => {'value' => dataset.provider, 'searchable' => true, 'sortable' => true},
      'status' => {'value' => dataset.status, 'searchable' => true, 'sortable' => true},
      'metadata' => {'value' => datasets_metadata[dataset.id], 'searchable' => false, 'sortable' => false, 'visible' => false},
      'owner' => {'value' => user_name(dataset.user&.dig('email')), 'searchable' => true, 'sortable' => true},
      'created' => {'value' => dataset.created_at, 'searchable' => true, 'sortable' => true},
      'edited' => {'value' => dataset.updated_at, 'searchable' => true, 'sortable' => true},
      'widgets' => {'value' => (dataset.widgets || [])}
    }
    if edit_url(dataset)
      processed_dataset['edit'] =
        {'value' => edit_url(dataset), 'method' => 'get'}
    end
    if delete_url(dataset)
      processed_dataset['delete'] =
        {'value' => delete_url(dataset), 'method' => 'delete'}
    end
    processed_dataset
  end

  def user_name(email)
    return unless email

    user = User.find_by(email: email)
    user ? user.name : nil
  end

  def edit_url(dataset)
    return if !current_user_is_admin &&
      !current_user.owned_sites.include?(@site) &&
      current_user.email != dataset.user.dig('email')

    edit_management_site_dataset_dataset_step_path(
      params[:site_slug],
      dataset.id,
      id: :title
    )
  end

  # Only shows the delete url in case the user is a site admin for this site
  def delete_url(dataset)
    return if !current_user_is_admin &&
      !current_user.owned_sites.include?(@site)

    management_site_dataset_path(
      params[:site_slug],
      dataset.id,
      action: :delete
    )
  end
end
