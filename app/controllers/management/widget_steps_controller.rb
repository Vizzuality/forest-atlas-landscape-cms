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
    WidgetService.create(session[:user_token], widget_parameters)
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

  def set_site
    @site = Site.find_by(slug: params[:site_slug])
  end
end
