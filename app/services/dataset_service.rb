class DatasetService < ApiService
  include DatasetFieldsHelper

  @conn ||= connect

  # Gets all the existing datasets
  # This was changed in the new version of the API, and now it's paginated...
  # ... so this will get the first 10000 records
  # Params
  # ++status++ the status of the dataset
  def self.get_datasets(status: 'saved', dataset_ids: nil)
    dataset_request = @conn.get '/v1/dataset',
                                'page[number]': '1',
                                'page[size]': '10000',
                                'status': status,
                                'application': ENV.fetch('API_APPLICATIONS'),
                                ids: dataset_ids,
                                '_': Time.now.to_s

    # TODO: If the number of datasets exceeds X, we should perform several requests
    # otherwise the URL might be too long
    begin
      datasets_json = JSON.parse dataset_request.body

      datasets = []
      datasets_json['data'].each do |data|
        dataset = Dataset.new data
        datasets.push dataset
      end
    rescue StandardError => e
      # TODO: All this methods should throw an exception caught in the controller...
      # ... to render a different page
      Rails.logger.error "::DatasetService.get_datasets: #{e}"
      return []
    end

    datasets
  end

  # Gets the fields that exist on a dataset
  # Params
  # +dataset_id+:: The id of the dataset
  # +api_table_name+:: The name of the database's table
  def self.get_fields(dataset_id, api_table_name, token = nil)
    fields_request = @conn.get do |req|
      req.url "/fields/#{dataset_id}"
      req.headers['Authorization'] = "Bearer #{token}" if token
    end

    fields_json = JSON.parse fields_request.body

    return {} if fields_json.empty? || !fields_request.success?

    fields = []

    fields_json&.dig('fields')&.each do |data|
      if DatasetFieldsHelper.is_valid? data.last['type']
        fields << {name: data.first, type: data.last['type']}
      end
    end
    get_fields_attributes fields, api_table_name, dataset_id
  end

  # Performs a query on the dataset
  # Params:
  # +dataset_id+:: The dataset to be queried
  # +query+:: The query to perform
  def self.get_filtered_dataset(dataset_id, query)
    full_query = "/v1/query/#{dataset_id}?sql=#{query}"

    Rails.logger.info "Going to make a Filtered Request: #{full_query}"

    filtered_request = @conn.get full_query
    if filtered_request.body.blank? || filtered_request.status != 200
      Rails.logger.warn "There was a problem with the response from the API: #{filtered_request}"
      {}
    else
      result = JSON.parse filtered_request.body
      result['data'] = result['data'].collect do |elem|
        elem.delete('_id') if elem.is_a?(Hash)
        elem
      end

      result
    end
  end

  # Gets the metadata of a dataset
  # Params:
  # +dataset_id+:: The dataset for which to get the metadata
  def self.get_metadata(dataset_id, token = nil)
    # TODO: Check if both requests are equal
    # request = @conn.get "/dataset/#{dataset_id}?includes=metadata,user,widget"
    request = @conn.get do |req|
      req.url "/dataset?ids=#{dataset_id}&includes=metadata,user,widget,vocabulary"
      req.headers['Authorization'] = "Bearer #{token}" if token
    end

    request.body.blank? ? {} : JSON.parse(request.body)
  end

  # Gets the metadata of a list of datasets
  # Params:
  # +dataset_id+:: A list of datasets' ids
  def self.get_metadata_list(dataset_ids, token = nil)
    return [] if dataset_ids.blank?

    request = @conn.get do |req|
      req.url '/v1/dataset?' \
        "ids=#{dataset_ids.join(',')}&" \
        'includes=vocabulary,user&' \
        'page[number]=1&' \
        'page[size]=10000&' \
        "_=#{Time.now.to_f}"
      req.headers['Authorization'] = "Bearer #{token}" if token
    end

    request.body.blank? ? {} : JSON.parse(request.body)
  end

  def self.metadata_find_by_ids(token, dataset_ids)
    return [] if dataset_ids.blank?

    res = @conn.post do |req|
      req.url '/v1/dataset/metadata/find-by-ids'
      req.headers['Authorization'] = "Bearer #{token}"
      req.headers['Content-Type'] = 'application/json'
      req.body = {ids: dataset_ids}.to_json
    end

    parsed_res = JSON.parse(res.body)
    parsed_res['data'] || []
  end

  # TODO : Move this to the model
  # Gets the fields attributes for a dataset (name, type, min, max, and values)
  # Params:
  # +fields+:: The list of fields to the get the attributes for
  # +api_table_name+:: The name of the table to select the attributes from
  # +dataset_id+:: The id of the dataset
  def self.get_fields_attributes(fields, api_table_name, dataset_id)
    number_dataset = {}
    numeric_fields = fields.select { |f| DatasetFieldsHelper.is_enumerable?(f[:type]) }
    # query in 5s - sth seems to go wrong in the API when too many select expressions
    numeric_fields.each_slice(5) do |fields|
      query = 'select '
      field_names = []
      fields.each do |field|
        field_names << " min(#{field[:name]}) as min_#{field[:name]}, max(#{field[:name]}) as max_#{field[:name]} "
      end
      query += field_names.join(', ')
      query += " from #{api_table_name}"

      result = get_filtered_dataset dataset_id, query

      if result['data']&.any?
        number_dataset = number_dataset.merge(result['data'][0])
      end
    end

    string_datasets = {}

    fields.select { |f| DatasetFieldsHelper.is_string?(f[:type]) }.each do |field|
      query = "select #{field[:name]} from #{api_table_name} group by #{field[:name]}"
      string_datasets[field[:name]] = get_filtered_dataset(dataset_id, query)
    end

    fields.each do |field|
      case field[:type]
      when ->(type) { DatasetFieldsHelper.is_enumerable?(type) }
        field[:min] = number_dataset["min_#{field[:name]}"]
        field[:max] = number_dataset["max_#{field[:name]}"]
      when ->(type) { DatasetFieldsHelper.is_string?(type) }
        data = string_datasets[field[:name]]['data']
        field[:values] = data.blank? ? [] : data.map { |x| x[field[:name]] }
      end
      field[:type] = DatasetFieldsHelper.parse(field[:type])
    end
    fields
  end

  def self.save_metadata(token, dataset_id, application, name, tags_array = [], metadata = {})
    metadata_body = {
      application: application,
      language: metadata[:language],
    }

    application_properties = metadata.slice(*Dataset::APPLICATION_PROPERTIES)
    application_properties[:tags] = tags_array.join(',') if tags_array.any?
    unless application_properties.blank?
      metadata_body[:applicationProperties] = application_properties
    end

    metadata_body.merge!(metadata.slice(*Dataset::API_PROPERTIES))

    metadata_body = metadata_body.to_json

    begin
      Rails.logger.info 'Saving dataset Metadata in the API.'
      Rails.logger.info "Body: #{metadata_body}"

      metadata_res = yield(metadata_body)

      Rails.logger.info "Response from dataset metadata endpoint: #{metadata_res.body}"
    rescue => e
      Rails.logger.error "Error updating dataset metadata in the API: #{e}"
      return nil
    end
    true
  end

  def self.create_metadata(token, dataset_id, application, name, tags_array = [], metadata = {})
    (metadata.is_a?(Array) ? metadata : [metadata]).each do |metadata_info|
      save_metadata(token, dataset_id, application, name, tags_array, metadata_info) do |body|
        @conn.post do |req|
          req.url "/dataset/#{dataset_id}/metadata"
          req.headers['Authorization'] = "Bearer #{token}"
          req.headers['Content-Type'] = 'application/json'
          req.body = body
        end
      end
    end
  end

  def self.update_metadata(token, dataset_id, application, name, tags_array = [], metadata = {})
    (metadata.is_a?(Array) ? metadata : [metadata]).each do |metadata_info|
      save_metadata(token, dataset_id, application, name, tags_array, metadata_info) do |body|
        @conn.patch do |req|
          req.url "/dataset/#{dataset_id}/metadata"
          req.headers['Authorization'] = "Bearer #{token}"
          req.headers['Content-Type'] = 'application/json'
          req.body = body
        end
      end
    end
  end

  def self.delete_metadata(token, dataset_id, application, language)
    begin
      Rails.logger.info 'Deleting dataset metadata in the API'
      Rails.logger.info "Dataset: #{dataset_id}"
      Rails.logger.info "Application: #{application}"
      Rails.logger.info "Language: #{language}"

      metadata_res = @conn.delete do |req|
        req.url "/dataset/#{dataset_id}/metadata?application=#{application}&language=#{language}"
        req.headers['Authorization'] = "Bearer #{token}"
      end

      Rails.logger.info "Response from dataset metadata endpoint: #{metadata_res.body}"
    rescue => e
      Rails.logger.error "Error deleting dataset metadata in the API: #{e}"
      return nil
    end
    true
  end

  def self.update(token, data)
    formatted_caption = data[:legend] || {}
    formatted_caption['country'] = formatted_caption['country']
    formatted_caption['region'] = formatted_caption['region']
    formatted_caption['date'] = formatted_caption['date']

    body = data[:connector] == 'json' ? {dataPath: data[:data_path]} : {}
    body.merge!(
      connectorType: data[:type],
      provider: data[:provider],
      connectorUrl: data[:connector_url],
      legend: formatted_caption,
      application: data[:application],
      name: data[:name],
      vocabularies: {
        legacy: {
          tags: data[:tags]&.split(',') || []
        }
      }
    )

    body = body.to_json

    begin
      Rails.logger.info 'Updating Dataset in the API.'
      Rails.logger.info "Body: #{body}"

      res = @conn.patch do |req|
        req.url "/dataset/#{data[:id]}"
        req.headers['Authorization'] = "Bearer #{token}"
        req.headers['Content-Type'] = 'application/json'
        req.body = body
      end

      Rails.logger.info "Response from dataset updating endpoint: #{res.body}"
      JSON.parse(res.body)
    rescue => e
      Rails.logger.error "Error updating dataset in the API: #{e}"
    end
  end

  # Updates the dataset in the API
  # To do so, the attribute "overwrite" must be set to true
  # And the must be a post request to /data-overwrite
  def self.update_connector(token, id, connector_url)
    body = {
      overwrite: true
    }.to_json

    Rails.logger.info "Updating Dataset #{id} overwrite property."
    Rails.logger.info "Body: #{body}"

    res = @conn.patch do |req|
      req.url "/dataset/#{id}"
      req.headers['Authorization'] = "Bearer #{token}"
      req.headers['Content-Type'] = 'application/json'
      req.body = body
    end

    Rails.logger.info "Response from dataset creation endpoint: #{res.body}"
    body = {
      provider: 'csv',
      url: connector_url
    }.to_json

    Rails.logger.info "Updating Dataset #{id} connectorUrl."
    Rails.logger.info "Body: #{body}"

    res = @conn.post do |req|
      req.url "/dataset/#{id}/data-overwrite"
      req.headers['Authorization'] = "Bearer #{token}"
      req.headers['Content-Type'] = 'application/json'
      req.body = body
    end

    Rails.logger.info "Response from dataset creation endpoint: #{res.body}"
    JSON.parse(res.body)['data']['id']
  rescue => e
    Rails.logger.error "Error creating new dataset in the API: #{e}"
  end

  # Sends the dataset to the API
  def self.upload(token, connector_type, connector_provider, connector_url, data_path,
                  application, name, tags_array = [], caption = {}, metadata = {})
    # Converting the caption[country] JSON
    formatted_caption = caption.dup
    formatted_caption['country'] = formatted_caption['country']&.split(' ')
    formatted_caption['region'] = formatted_caption['region']&.split(' ')
    formatted_caption['date'] = formatted_caption['date']&.split(' ')

    body = connector_type == 'json' ? {dataPath: data_path} : {}
    body.merge!(
      connectorType: connector_type,
      provider: connector_provider,
      connectorUrl: connector_url,
      legend: formatted_caption,
      application: [application],
      name: name,
      vocabularies: {
        legacy: {
          tags: tags_array
        }
      }
    )
    body = body.to_json

    begin
      Rails.logger.info 'Creating Dataset in the API.'
      Rails.logger.info "Body: #{body}"

      res = @conn.post do |req|
        req.url '/dataset'
        req.headers['Authorization'] = "Bearer #{token}"
        req.headers['Content-Type'] = 'application/json'
        req.body = body
      end

      Rails.logger.info "Response from dataset creation endpoint: #{res.body}"
      dataset_id = JSON.parse(res.body)['data']['id']
    rescue => e
      Rails.logger.error "Error creating new dataset in the API: #{e}"
      return nil
    end

    if dataset_id.present?
      create_metadata(token, dataset_id, application, name, tags_array, metadata)
    end
    dataset_id
  end

  def self.delete(token, dataset_id)
    response = @conn.delete do |req|
      req.url "dataset/#{dataset_id}"
      req.headers['Authorization'] = "Bearer #{token}"
      req.headers['Content-Type'] = 'application/json'
    end

    if response.status == 200
      {valid: true, message: 'Dataset deleted successfully'}
    else
      {valid: false, message: 'Dataset failed to delete'}
    end
  end
end
