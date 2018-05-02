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
    WidgetService.update(session[:user_token], widget_parameters)
  end

  def create
    created = WidgetService.create(session[:user_token], widget_parameters)
    #WidgetService.create_metadata(session[:user_token], metadata_parameters) if created
  end

  private

  def get_datasets
    DatasetService.get_datasets
  end

  def widget_parameters
    all_options = params.require(:widget).fetch(:widgetConfig, nil).try(:permit!)
    params.require(:widget)
          .permit(:id, :name, :description,
                  :published, :default, :dataset)
          .merge(widgetConfig: all_options)
  end

  def metadata_parameters
    params.require(:metadata)
  end

  def set_site
    @site = Site.find_by(slug: params[:site_slug])
  end
end
