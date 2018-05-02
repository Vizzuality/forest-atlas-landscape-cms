class WidgetService < ApiService

  @conn ||= connect

  def self.get_widgets(status = 'saved')
    widgets_request = @conn.get '/v1/widget',
                                'page[number]': '1', 'page[size]': '10000',
                                'status': status,
                                'application': ENV.fetch('API_APPLICATIONS'),
                                'env': ENV.fetch('API_ENV'),
                                '_': Time.now.to_s

    widgets_json = JSON.parse widgets_request.body

    widgets = []
    begin
      widgets_json['data'].each do |data|
        # TODO: Refactor!!! The service can't depend on the model
        widget = Widget.new data
        widgets.push widget
      end
    rescue Exception => e
      # TODO All this methods should throw an exception caught in the controller...
      # ... to render a different page
      Rails.logger.error "::WidgetService.get_widgets: #{e}"
    end

    widgets
  end

  def self.widget(id)
    begin
      widgets_request = @conn.get "/v1/widget/#{id}"
      widget_json = JSON.parse widgets_request.body
      widget = Widget.new widget_json['data']
    rescue Exception
      return nil
    end

    widget
  end

  def self.update(token, widget_params)
    widget = Widget.new widget_params
    begin
      Rails.logger.info 'Creating Widget in the API.'
      Rails.logger.info "Widget: #{widget}"

      res = @conn.update do |req|
        req.url 'widget'
        req.headers['Authorization'] = "Bearer #{token}"
        req.headers['Content-Type'] = 'application/json'
        req.body = widget
      end

      Rails.logger.info "Response from widget creation endpoint: #{res.body}"
      widget_id = JSON.parse(res.body)['data']['id']
    rescue => e
      Rails.logger.error "Error creating new widget in the API: #{e}"
      return nil
    end
    widget_id

  end

  def self.create(token, widget_params)
    widget = Widget.new
    widget.set_attributes(widget_params)
    widget.application = ['forest-atlas']
    begin
      Rails.logger.info 'Creating Widget in the API.'
      Rails.logger.info "Widget: #{widget}"

      res = @conn.post do |req|
        req.url 'widget'
        req.headers['Authorization'] = "Bearer #{token}"
        req.headers['Content-Type'] = 'application/json'
        req.body = widget.attributes.to_json
      end

      Rails.logger.info "Response from widget creation endpoint: #{res.body}"
      widget_id = JSON.parse(res.body)['data']['id']
    rescue => e
      Rails.logger.error "Error creating new widget in the API: #{e}"
      return nil
    end
    widget_id
  end

end
