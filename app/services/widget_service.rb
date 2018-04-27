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

  def self.upload

  end

end
