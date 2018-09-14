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

  def self.update(token, dataset_id, widget_params, widget_id)
    widget = Widget.new
    widget.set_attributes widget_params
    begin
      Rails.logger.info 'Creating Widget in the API.'
      Rails.logger.info "Widget: #{widget}"

      res = @conn.patch do |req|
        req.url "dataset/#{dataset_id}/widget/#{widget_id}"
        req.headers['Authorization'] = "Bearer #{token}"
        req.headers['Content-Type'] = 'application/json'
        req.body = widget.attributes.to_json
      end

      raise JSON.parse(res.body)['errors'].first['detail'] unless res.status == 200

      Rails.logger.info "Response from widget creation endpoint: #{res.body}"
      widget_id = JSON.parse(res.body)['data']['id']
    rescue => e
      Rails.logger.error "Error creating new widget in the API: #{e}"
      return e.message
    end
    widget_id

  end

  def self.create(token, widget_params, dataset_id)
    widget = Widget.new
    widget.set_attributes(widget_params)
    widget.application = ['forest-atlas']
    begin
      Rails.logger.info 'Creating Widget in the API.'
      Rails.logger.info "Widget: #{widget}"

      res = @conn.post do |req|
        req.url "dataset/#{dataset_id}/widget"
        req.headers['Authorization'] = "Bearer #{token}"
        req.headers['Content-Type'] = 'application/json'
        req.body = widget.attributes.to_json
      end

      raise JSON.parse(res.body)['errors'].first['detail'] unless res.status == 200

      Rails.logger.info "Response from widget creation endpoint: #{res.body}"
      widget_id = JSON.parse(res.body)['data']['id']
    rescue => e
      Rails.logger.error "Error creating new widget in the API: #{e}"
      raise e.message
    end
    widget_id
  end

  def self.delete(token, widget_id)
    @conn.delete do |req|
      req.url "widget/#{widget_id}"
      req.headers['Authorization'] = "Bearer #{token}"
      req.headers['Content-Type'] = 'application/json'
    end
  end

  def self.create_metadata(token, metadata_params, widget_id, dataset_id)
    @conn.post do |req|
      req.url "dataset/#{dataset_id}/widget/#{widget_id}/metadata"
      req.headers['Authorization'] = "Bearer #{token}"
      req.headers['Content-Type'] = 'application/json'
      req.body = metadata_params.to_json
    end
  end

  def self.create_layer(token, layer_params, dataset_id)
    res =
        @conn.post do |req|
        req.url "dataset/#{dataset_id}/layer"
        req.headers['Authorization'] = "Bearer #{token}"
        req.headers['Content-Type'] = 'application/json'
        req.body = layer_params.to_json
      end
    JSON.parse(res.body)['data']['id']
  end

  def self.update_metadata(token, metadata_params, dataset_id, widget_id)
    @conn.patch do |req|
      req.url "dataset/#{dataset_id}/widget/#{widget_id}/metadata"
      req.headers['Authorization'] = "Bearer #{token}"
      req.headers['Content-Type'] = 'application/json'
      req.body = metadata_params.to_json
    end
  end

  # Returns the widgets of a list of datasets
  def self.from_datasets(dataset_ids, status = 'saved')
    widgets_request = @conn.get 'dataset',
                                'ids': dataset_ids.join(','),
                                'includes': 'widget',
                                'page[number]': '1', 'page[size]': '10000',
                                'status': status,
                                'application': ENV.fetch('API_APPLICATIONS'),
                                'env': ENV.fetch('API_ENV'),
                                '_': Time.now.to_s

    widgets_json = JSON.parse widgets_request.body

    widgets = []
    begin
      widgets_json['data'].each do |data|
        next if data['attributes']['widget'].blank?
        data.dig('attributes', 'widget').each do |data_widget|
          widget = Widget.new data_widget
          widgets.push widget
        end
      end
    rescue Exception => e
      Rails.logger.error "::WidgetService.get_widgets: #{e}"
    end

    widgets
  end
end
