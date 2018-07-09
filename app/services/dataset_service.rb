class DatasetService < ApiService
  include DatasetFieldsHelper

  @conn ||= connect

  # Gets all the existing datasets
  # This was changed in the new version of the API, and now it's paginated...
  # ... so this will get the first 10000 records
  # Params
  # ++status++ the status of the dataset
  def self.get_datasets(status: 'saved', dataset_ids: nil)
    datasetRequest = @conn.get '/v1/dataset',
                               {'page[number]': '1', 'page[size]': '10000',
                                'status': status, 'application': 'forest-atlas,gfw,prep',
                                ids: dataset_ids,
                                '_': Time.now.to_s}

    datasetsJSON = JSON.parse datasetRequest.body

    datasets = []
    begin
      datasetsJSON['data'].each do |data|
        # TODO: Refactor!!! The service can't depend on the model
        dataset = Dataset.new data
        datasets.push dataset
      end
    rescue Exception => e
      # TODO All this methods should throw an exception caught in the controller...
      # ... to render a different page
      Rails.logger.error "::DatasetService.get_datasets: #{e}"
    end

    datasets
  end

  # Gets the fields that exist on a dataset
  # Params
  # +dataset_id+:: The id of the dataset
  # +api_table_name+:: The name of the database's table
  def self.get_fields(dataset_id, api_table_name)
    fieldsRequest = @conn.get "/fields/#{dataset_id}"
    fieldsJSON = JSON.parse fieldsRequest.body

    return {} if fieldsJSON.empty? || !fieldsRequest.success?

    fields = []

    fieldsJSON['fields'].each do |data|
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

    filteredRequest = @conn.get full_query
    if filteredRequest.body.blank? || filteredRequest.status != 200
      Rails.logger.warn "There was a problem with the response from the API: #{filteredRequest}"
      return {}
    else
      result = JSON.parse filteredRequest.body
      result['data'] = result['data'].collect do |elem|
        elem.delete('_id') if elem.is_a?(Hash)
        elem
      end

      return result
    end
  end

  # Gets the metadata of a dataset
  # Params:
  # +dataset_id+:: The dataset for which to get the metadata
  def self.get_metadata(dataset_id)
    request = @conn.get "/dataset/#{dataset_id}?includes=metadata"
    if request.body.blank?
      return {}
    else
      return JSON.parse request.body
    end
  end

  # Gets the metadata of a list of datasets
  # Params:
  # +dataset_id+:: A list of datasets' ids
  def self.get_metadata_list(dataset_ids)
    return [] if dataset_ids.blank?
    request = @conn.get "/v1/dataset?ids=#{dataset_ids.join(',')}", {
      'includes': 'vocabulary',
      'page[number]': '1', 'page[size]': '10000', '_': Time.now.to_f
    }
    if request.body.blank?
      return {}
    else
      return JSON.parse request.body
    end
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

      if result['data'] && result['data'].any?
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
        when -> (type) { DatasetFieldsHelper.is_enumerable?(type) }
          field[:min] = number_dataset["min_#{field[:name]}"]
          field[:max] = number_dataset["max_#{field[:name]}"]
        when -> (type) { DatasetFieldsHelper.is_string?(type) }
          data = string_datasets[field[:name]]['data']
          if data.blank?
            field[:values] = []
          else
            field[:values] = data.map{|x| x[field[:name]]}
          end
      end
      field[:type] = DatasetFieldsHelper.parse(field[:type])
    end
    fields
  end

  def self.save_metadata(token, dataset_id, application, name, tags_array = [], metadata = {})
    metadata_body = {
      application: application,
      name: name,
      applicationProperties: metadata.slice(*Dataset::APPLICATION_PROPERTIES).
      merge(tags: tags_array)
    }.merge(
      metadata.slice(*Dataset::API_PROPERTIES)
      ).to_json

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
    save_metadata(token, dataset_id, application, name, tags_array, metadata) do |body|
      @conn.post do |req|
        req.url "/dataset/#{dataset_id}/metadata"
        req.headers['Authorization'] = "Bearer #{token}"
        req.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        req.body = body
      end
    end
  end

  def self.update_metadata(token, dataset_id, application, name, tags_array = [], metadata = {})
    save_metadata(token, dataset_id, application, name, tags_array, metadata) do |body|


      @conn.patch do |req|
        req.url "/dataset/#{dataset_id}/metadata"
        req.headers['Authorization'] = "Bearer #{token}"
        req.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        req.body = body
      end
    end
  end

  # Sends the dataset to the API
  def self.upload(token, connectorType, connectorProvider, connectorUrl, dataPath,
    application, name, tags_array = [], caption = {}, metadata = {})

    formatted_caption = caption.dup
    # Converting the caption[country] JSON
    begin
      formatted_caption['country'] = formatted_caption['country'].split(' ')
      formatted_caption['region'] = formatted_caption['region'].split(' ')
      formatted_caption['date'] = formatted_caption['date'].split(' ')
    rescue
    end

    body = if connectorType == 'json'
      {dataPath: dataPath}
    else
      {}
    end.merge({
      connectorType: connectorType,
      provider: connectorProvider,
      connectorUrl: connectorUrl,
      legend: formatted_caption,
      application: [application],
      name: name,
      vocabularies: {
        legacy: {
          tags: tags_array
        }
      }
    }).to_json

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
end
