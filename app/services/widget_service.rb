class WidgetService < ApiService

  @conn ||= connect

  def self.get_widgets(status = 'saved')
    widgetsRequest = @conn.get '/v1/widget',
                               'page[number]': '1', 'page[size]': '10000',
                               'status': status,
                               'application': 'forest-atlas,gfw,prep',
                               '_': Time.now.to_s

    widgetsJSON = JSON.parse widgetsRequest.body

    widgets = []
    begin
      widgetsJSON['data'].each do |data|
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

  def self.upload

  end

end
