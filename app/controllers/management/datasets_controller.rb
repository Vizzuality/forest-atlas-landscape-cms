class Management::DatasetsController < ManagementController

  before_action :ensure_management_user, only: :destroy
  before_action :set_site, only: [:index, :new, :create]
  before_action :set_dataset, only: [:edit, :destroy]
  before_action :set_datasets, only: [:index]

  # Validate if user can modify the dataset
  before_action :authenticate_user_for_site!

  def index
    metadata_list = DatasetService.metadata_find_by_ids(session[:user_token], @datasets.map(&:id))
    @dataset_metadata =
      Hash[metadata_list.map do |d|
        attributes = d['attributes'].symbolize_keys
        application_properties = attributes[:applicationProperties].try(:symbolize_keys)
        metadata = attributes.slice(*Dataset::API_PROPERTIES)
        metadata = metadata.merge(application_properties.slice(*Dataset::APPLICATION_PROPERTIES)) if application_properties.present?
        [
          attributes[:dataset],
          metadata.values.reject{ |v| v.blank? }
        ]
      end]

    gon.datasets = @datasets.map do |dataset|
      {
        'title' => {'value' => dataset.name, 'searchable' => true, 'sortable' => true},
        'contexts' => {'value' => ContextDataset.where(dataset_id: dataset.id).map{|ds| ds.context.name}.join(', '), 'searchable' => true, 'sortable' => false},
        'connector' => {'value' => dataset.provider, 'searchable' => true, 'sortable' => true},
        'tags' => {'value' => dataset.tags, 'searchable' => true, 'sortable' => false},
        'status' => {'value' => dataset.status, 'searchable' => true, 'sortable' => true},
        'metadata' => {'value' => @dataset_metadata[dataset.id], 'searchable' => true, 'sortable' => false, 'visible' => false}
        # TODO: once both actions work properly, restore buttons
        # 'edit' => {'value' => edit_management_site_dataset_dataset_step_path(@site.slug, dataset.id, 'title'), 'method' => 'get'},
        # 'delete' => {'value' => management_site_dataset_path(@site.slug, dataset.id), 'method' => 'delete'}
      }
    end
  end

  # TODO: What should happen when we destroy a dataset??
  def destroy
    #@dataset.destroy
    redirect_to controller: 'management/datasets', action: 'index', site_slug: @site.slug, notice: 'Dataset was successfully destroyed.'
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
    @datasets = @site.get_datasets
  end
end
