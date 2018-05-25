class Management::WidgetStepsController < ManagementController

  before_action :set_site
  before_action :authenticate_user_for_site!
  before_action :ensure_management_user, only: :destroy

  def new
    @datasets = get_datasets
  end

  def edit
    @datasets = nil
    @widget = WidgetService.widget(params[:id])
  end

  def update
    dataset_id = widget_parameters[:dataset]

    begin
      widget_id = WidgetService.update(session[:user_token],
                                       dataset_id,
                                       widget_parameters, params[:id])
    rescue Exception => e
      render json: { widget_error: e.to_s }.to_json, status: 500 and return
    end

    begin
      if widget_id && params[:metadata].present?
        WidgetService.update_metadata(session[:user_token], params[:metadata],
                                      dataset_id, widget_id)
      end
    rescue Exception => e
      render json: { metadata_error: e.to_s }.to_json, status: 500 and return
    end

    render status: 200, json: {}
  end

  def create
    dataset_id = widget_parameters[:dataset]
    params_metadata = if params[:metadata].present?
                        params[:metadata]
                      else
                        Widget::DEFAULT_WIDGET
                      end
    # Starts by creating the layers, if present
    begin
      if layer_parameters.present?
        layer_id = WidgetService.create_layer(session[:user_token],
                                              layer_parameters, dataset_id)
        params['widget']['widgetConfig']['layer_id'] = layer_id
        params['widget']['widgetConfig']['paramsConfig']['layer'] = layer_id
      end
    rescue Exception => e
      render json: { widget_error: e.to_s }.to_json, status: 500 and return
    end

    # Creates the widget
    begin
      widget_id = WidgetService.create(session[:user_token],
                                       widget_parameters, dataset_id)
    rescue Exception => e
      render json: { widget_error: e.to_s }.to_json, status: 500 and return
    end

    # Creates the widget metadata
    begin
      if widget_id
        WidgetService.create_metadata(session[:user_token], params_metadata,
                                      widget_id, dataset_id)
      end
    rescue Exception => e
      render json: { metadata_error: e.to_s }.to_json, status: 500 and return
    end

    render status: 200, json: {}
  end

  def destroy
    begin
      WidgetService.delete(session[:user_token], params[:id])
    rescue Exception => e
      render json: { widget_error: e.to_s }.to_json, status: 500 and return
    end

    render status: 200, json: {}
  end

  private

  def get_datasets
    DatasetService.get_datasets
  end

  def widget_parameters
    all_options = params.require(:widget)
                    .fetch(:widgetConfig, nil).try(:permit!)
    params.require(:widget)
          .permit(:id, :name, :description,
                  :published, :default, :dataset)
          .merge(widgetConfig: all_options)
  end

  def layer_parameters
    params.require(:layer)
      .permit(:name, :description, :dataset, :provider, application: [],
              layerConfig: [
                :account, body: [
                  :minzoom, :maxzoom, layers: [
                    :type, options: [
                        :sql, :cartocss, :cartocss_version ]]]])
  end

  def set_site
    @site = Site.find_by(slug: params[:site_slug])
  end
end
