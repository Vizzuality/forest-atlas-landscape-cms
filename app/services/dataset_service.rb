class DatasetService

  @conn ||= Faraday.new(:url => ENV.fetch("API_URL")) do |faraday|
    faraday.request :url_encoded
    faraday.response :logger
    faraday.adapter Faraday.default_adapter
  end

  # Gets all the existing datasets
  # This was changed in the new version of the API, and now it's paginated...
  # ... so this will get the first 10000 records
  # Params
  # ++status++ the status of the dataset
  def self.get_datasets(status = 'active')
    datasetRequest = @conn.get '/dataset' , {'page[number]': '1', 'page[size]': '10000', \
      'status': status, 'app': 'forest-atlas,gfw'}
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

    return {} unless fieldsJSON || fieldsRequest.status != 200

    fields = []
    fieldsJSON['fields'].each do |data|
      if %w[number date string long double int].any? {|x| data.last['type'].downcase.include?(x)}
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
    full_query = "/query/#{dataset_id}?sql=#{query}"

    Rails.logger.info "Going to make a Filtered Request: #{full_query}"

    filteredRequest = @conn.get full_query
    if filteredRequest.body.blank?
      Rails.logger.warn "There was a problem with the response from the API: #{filteredRequest}"
      return {}
    else
      return JSON.parse filteredRequest.body
    end
  end

  # Gets the metadata of a dataset
  # Params:
  # +dataset_id+:: The dataset for which to get the metadata
  def self.get_metadata(dataset_id)
    request = @conn.get "/dataset/#{dataset_id}?include=metadata"
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
    request = @conn.get "/dataset?ids=#{dataset_ids.join(',')}", {'page[number]': '1', 'page[size]': '10000', 'status': 'all'}
    if request.body.blank?
      return {}
    else
      return JSON.parse request.body
    end
  end

  # TODO : Move this to the model
  # Gets the fields attributes for a dataset (name, type, min, max, and values)
  # Params:
  # +fields+:: The list of fields to the get the attributes for
  # +api_table_name+:: The name of the table to select the attributes from
  # +dataset_id+:: The id of the dataset
  def self.get_fields_attributes fields, api_table_name, dataset_id
    query = 'select '
    field_names = []
    fields.select{|f| %w[number date long double].any?{|x| f[:type].downcase.include?(x)}  }.each do |field|
      field_names << " min(#{field[:name]}) as min_#{field[:name]} , max(#{field[:name]}) as max_#{field[:name]} "
    end
    query += field_names.join(', ')
    query += " from #{api_table_name}"

    number_dataset = get_filtered_dataset dataset_id, query unless field_names.blank?

    string_datasets = {}
    fields.select {|f| f[:type].downcase.include?('string')}.each do |field|
      query = "select count(*), #{field[:name]} from #{api_table_name} group by #{field[:name]}"
      string_datasets[field[:name]] = get_filtered_dataset(dataset_id, query)
    end

    fields.each do |field|
      case field[:type]
        when /number/, /date/, /long/, /double/
          field[:min] = number_dataset['data'][0]["min_#{field[:name]}"]
          field[:max] = number_dataset['data'][0]["max_#{field[:name]}"]
        when /string/
          field[:values] = string_datasets[field[:name]]['data'].map{|x| x[field[:name]]}
      end
    end
    fields
  end

  # Sends the dataset to the API
  def self.upload(token, connectorType, connectorProvider, connectorUrl,
                    applications, name, tags_array = nil, caption = {}, units = nil)

    formatted_caption = caption.dup
    # Converting the caption[country] JSON
    begin
      formatted_caption['country'] = formatted_caption['country'].split(' ')
      formatted_caption['region'] = formatted_caption['region'].split(' ')
      formatted_caption['date'] = formatted_caption['date'].split(' ')
    rescue
    end


    begin
      body = "{
            \"dataset\": {
              \"connectorType\": \"#{connectorType}\",
              \"provider\": \"#{connectorProvider}\",
              \"connectorUrl\": \"#{connectorUrl}\",
              \"legend\": #{formatted_caption.to_json},
              \"application\": #{applications.to_json},
              \"name\": \"#{name}\",
              \"tags\": #{tags_array.to_json}
            }
          }"

      Rails.logger.info 'Creating Dataset in the API.'
      Rails.logger.info "Body: #{body}"

      res = @conn.post do |req|
        req.url '/dataset'
        req.headers['Authorization'] = "Bearer #{token}"
        req.headers['Content-Type'] = 'application/json'
        req.body = body
      end

      # TODO Make another request to dataset/:id/metadata
      # ... to put the units
      # body: {
      #   application: ["a", "b"],
      #   language: {"en"},
      #   units: [{"a": "b"}, {"b": "c"}]
      # }


      #\"info\": {
      #          \"units\" : #{units.to_json}
      #          }
      #        }

      Rails.logger.info "Response from dataset creation endpoint: #{res.body}"

    return JSON.parse(res.body)['data']['id']

    rescue Exception => e
      Rails.logger.error "Error creating new dataset in the API: #{e}"
      return nil
    end
  end
end
