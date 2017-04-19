class StaticPageController < ApplicationController

  skip_before_action :set_current_user, only: [:no_permissions]

  # GET /no-permissions
  def no_permissions
  end

  # 404
  # GET /not_found
  def not_found
  end

  # Gets the data of a widget
  # GET widget_data
  def widget_data
    widget = Widget.find(params[:widget_id])
    data = widget.get_filtered_dataset false, 10000
    render json: {id: widget.id,
                  visualization: widget.visualization,
                  name: widget.name,
                  description: widget.description,
                  data: data['data']}.to_json
  end
end
