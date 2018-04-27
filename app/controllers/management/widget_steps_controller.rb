class Management::WidgetStepsController < ManagementController


  def new
    reset_session_key(:widget, @widget_id, {})
    @widget = nil
    @datasets = get_datasets
  end

  def edit
    reset_session_key(:widget, @widget_id, {})
    @datasets = nil
    @widget = WidgetService.get_widgets(params[:id])
  end


  def update

  end

  private

  def get_datasets
    @site.get_datasets_contexts
  end
end
