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
      visualization: widget.widget_config,
      name: widget.name,
      description: widget.description,
      metadata: widget.metadata
    }
  end

  def subscriptions
    begin
      token = request.headers['Authorization']

      @conn ||= Faraday.new(:url => ENV.fetch("GFW_URL")) do |faraday|
        faraday.request :url_encoded
        faraday.response :logger
        faraday.adapter Faraday.default_adapter
      end

      res = @conn.get do |req|
        req.url ENV['SUBSCRIPTIONS_ENDPOINT']
        req.headers['Authorization'] = token
        req.headers['Content-Type'] = 'application/json'
      end

      subscriptions = res.body
      render json: subscriptions
    rescue
      render json: { error: 'Cannot access subscriptions' }
    end
  end
end
