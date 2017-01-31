class Publish::DatasetsController < PublishController

  before_action :set_site, only: :index
  before_action :set_datasets, only: :index

  # Validate if user can modify the dataset
  before_action :authenticate_user_for_site!

  def index
    gon.datasets = @datasets.map do |dataset|
      {
        'title' => {'value' => dataset.name, 'searchable' => true, 'sortable' => true},
        'contexts' => {'value' => ContextDataset.where(dataset_id: dataset.id).map{|ds| ds.context.name}.join(', '), 'searchable' => true, 'sortable' => false},
        'connector' => {'value' => dataset.provider, 'searchable' => true, 'sortable' => true},
        'tags' => {'value' => dataset.tags, 'searchable' => true, 'sortable' => false},
        'status' => {'value' => dataset.metadata['status'], 'searchable' => true, 'sortable' => true}
      }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_site
    @site = Site.find_by({slug: params[:site_slug]})

    if (@site.routes.any?)
      # We just want a valid URL for the site
      @url = @site.routes.first.host
    end
  end


  # TODO: Use cache for this
  # Gets the datasets from the API and sets them to the member variable
  def set_datasets
    @datasets = current_user.get_datasets 'all'

    @metadata_array = []
    @metadata_array = Dataset.get_metadata_list(@datasets.map{|ds| ds.id}) if @datasets

    # TODO: Find a better way to do this
    @datasets.each_with_index do |ds, i|
      ds.metadata = @metadata_array['data'][i]['attributes']
    end
  end
end
