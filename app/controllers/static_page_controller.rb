class StaticPageController < ApplicationController

  skip_before_action :set_current_user, only: [:no_permissions]

  # GET /no-permissions
  def no_permissions
  end

  # Gets the data of a widget
  # GET widget_data
  def widget_data
    widget = WidgetService.widget(params[:widget_id])
    render json: {
      id: widget.id,
      visualization: widget.widget_config,
      name: widget.name,
      description: widget.description
    }
  end
end
