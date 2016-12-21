class Management::DatasetsController < ManagementController

  before_action :set_site, only: [:index, :new, :create]
  before_action :set_dataset, only: [:edit, :destroy]
  before_action :set_datasets, only: [:index]

  # Validate if user can modify the dataset
  #before_action :authenticate_user_for_site!, only: [:index, :new, :create]
  #before_action :set_content_type_variables, only: [:new, :edit]

  def index
    gon.datasets = @datasets
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
      @url = @site.routes.first.host
    end
  end

  # Gets a dataset from the API and sets it to the member variable
  def set_dataset
    #@dataset = Data
  end

  # TODO: Use cache for this
  # Gets the datasets from the API and sets them to the member variable
  def set_datasets
    @datasets = current_user.get_datasets

    @metadata_array = []
    @datasets.each do |dataset|
      @metadata_array << dataset.get_metadata
    end
  end
end
