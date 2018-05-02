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
    dataset_id = widget_parameters[:dataset]
    begin
      widget_id = WidgetService.create(session[:user_token], widget_parameters, dataset_id)
    rescue Exception => e
      render json: { widget_error: e.to_s }.to_json, status: 500 and return
    end

    begin
      WidgetService.create_metadata(session[:user_token], metadata_parameters, widget_id, dataset_id) if widget_id
    rescue Exception => e
      render json: { metadata_error: e.to_s }.to_json, status: 500 and return
    end

    render status: 200, json: {}
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
