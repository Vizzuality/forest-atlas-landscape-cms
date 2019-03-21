class StaticPageController < ApplicationController

  # GET /no-permissions
  def no_permissions
    # Creates an empty user
    @user =
      if @current_user.present?
        User.find_by(email: @current_user[:email])
      else
        User.new
      end
  end

  # Gets the data of a widget
  # GET widget_data
  def widget_data
    widget = WidgetService.widget(params[:widget_id])
    render json: {
      id: widget.id,
      dataset: widget.dataset,
      visualization: widget.widget_config,
      name: widget.name,
      description: widget.description,
      metadata: widget.metadata
    }
  end
end
