class Management::WidgetStepsController < ManagementController

  before_action :set_site

  def new
    @datasets = get_datasets
  end

  def edit
    @datasets = nil
    @widget = WidgetService.get_widgets(params[:id])
  end

  def update
    DatasetService.update(widget_parameters)
  end

  def create
    DatasetService.create(widget_parameters)
  end

  private

  def get_datasets
    DatasetService.get_datasets
  end

  def widget_parameters
    params.require(:widget)
          .permit(:id, :user_id, :application, :slug, :name, :description,
                  :source, :source_url, :layer_id, :dataset, :authors,
                  :query_url, :widget_config, :template, :default,
                  :protected, :status, :published, :freeze, :verified)
  end

  def set_site
    @site = Site.find_by(slug: params[:site_slug])
  end
end
