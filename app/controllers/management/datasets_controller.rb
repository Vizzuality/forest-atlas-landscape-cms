class Management::DatasetsController < ManagementController

  before_action :ensure_management_user, only: [:destroy, :edit_metadata, :update_metadata]
  before_action :set_site, only: [:index, :new, :create, :edit_metadata, :update_metadata]
  before_action :set_dataset, only: [:edit, :destroy]
  before_action :set_datasets, only: [:index]

  # Validate if user can modify the dataset
  before_action :authenticate_user_for_site!

  def index
    @dataset_metadata = Dataset.get_metadata_list_for_frontend(session[:user_token], @datasets.map(&:id))

    @filteredDatasets = [];

    @datasets.each do |dataset|
      function = @dataset_metadata[dataset.id][:function] if @dataset_metadata[dataset.id].present?
      @filteredDatasets.push({
        'title' => {'value' => dataset.name, 'searchable' => true, 'sortable' => true},
        'contexts' => {'value' => ContextDataset.where(dataset_id: dataset.id).map{|ds| ds.context.name}.join(', '), 'searchable' => true, 'sortable' => false},
        'connector' => {'value' => dataset.provider, 'searchable' => true, 'sortable' => true},
        'function' => {'value' => function, 'searchable' => true, 'sortable' => false},
        'tags' => {'value' => dataset.tags[0..-2], 'searchable' => true, 'sortable' => false},
        'status' => {'value' => dataset.status, 'searchable' => true, 'sortable' => true},
        'metadata' => {'value' => @dataset_metadata[dataset.id], 'searchable' => false, 'sortable' => false, 'visible' => false},
        # TODO: once both actions work properly, restore buttons
        'edit' => {'value' => edit_metadata_management_site_dataset_path(@site.slug, dataset.id), 'method' => 'get'}
        # 'delete' => {'value' => management_site_dataset_path(@site.slug, dataset.id), 'method' => 'delete'}
      })

      # Untill we remove backbone, we need to keep this
      gon.datasets = @filteredDatasets;

    end
  end

  # TODO: What should happen when we destroy a dataset??
  def destroy
    #@dataset.destroy
    redirect_to controller: 'management/datasets', action: 'index', site_slug: @site.slug, notice: 'Dataset was successfully destroyed.'
  end

  def edit_metadata
    @dataset = Dataset.find_with_metadata(params[:id])
  end

  def update_metadata
    @dataset = Dataset.find_with_metadata(params[:id])
    @dataset.metadata = params[:dataset][:metadata]
    flash_message =
      if @dataset.update_metadata(session[:user_token])
        {notice: 'Metadata was successfully updated.'}
      else
        {alert: 'Metadata could not be updated.'}
      end
    redirect_to management_site_datasets_url(@site.slug), flash_message
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
