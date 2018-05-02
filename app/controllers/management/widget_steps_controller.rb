class Management::WidgetStepsController < ManagementController

  before_action :set_site
  before_action :authenticate_user_for_site!
  before_action :ensure_management_user, only: :destroy

  def new
    @datasets = get_datasets
  end

  def edit
    @datasets = nil
    @widget = WidgetService.get_widgets(params[:id])
  end

  def update
    dataset_id = widget_parameters[:dataset]
    begin
      WidgetService.update(session[:user_token], widget_parameters)
    rescue Exception => e
      render json: { widget_error: e.to_s }.to_json, status: 500 and return
    end

    begin
      if widget_id && params[:metadata]
        WidgetService.update_metadata(session[:user_token], params[:metadata], widget_id, dataset_id)
      end
    rescue Exception => e
      render json: { metadata_error: e.to_s }.to_json, status: 500 and return
    end

    render status: 200, json: {}
  end

  def create
    dataset_id = widget_parameters[:dataset]
    begin
      widget_id = WidgetService.create(session[:user_token], widget_parameters, dataset_id)
    rescue Exception => e
      render json: { widget_error: e.to_s }.to_json, status: 500 and return
    end

    begin
      if widget_id && params[:metadata]
        WidgetService.create_metadata(session[:user_token], params[:metadata], widget_id, dataset_id)
      end
    rescue Exception => e
      render json: { metadata_error: e.to_s }.to_json, status: 500 and return
    end

    render status: 200, json: {}
  end

  def destroy
    #TODO
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
