class DatasetService

  @conn ||= Faraday.new(:url => ENV.fetch("API_URL")) do |faraday|
    faraday.request :url_encoded
    faraday.response :logger
    faraday.adapter Faraday.default_adapter
  end

  # Gets all the existing datasets
  # This was changed in the new version of the API, and now it's paginated...
  # ... so this will get the first 10000 records
  def self.get_datasets
    datasetRequest = @conn.get '/dataset' , {'page[number]': '1', 'page[size]': '10000'}
    datasetsJSON = JSON.parse datasetRequest.body
    datasets = []

    datasetsJSON['data'].each do |data|
      dataset = Dataset.new data
      datasets.push dataset
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

    fields = []
    fieldsJSON['fields'].each do |data|
      if %w[number date string long double].include? data.last['type']
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

    filteredRequest = @conn.get full_query
    if filteredRequest.body.blank?
      return {}
    else
      return JSON.parse filteredRequest.body
    end
  end

  # Gets the metadata of a dataset
  # Params:
  # +dataset_id+:: The dataset for which to get the metadata
  def self.get_dataset(dataset_id)
    request = @conn.get "/dataset/#{dataset_id}"
    if request.body.blank?
      return {}
    else
      return JSON.parse request.body
    end
  end

  # Gets the fields attributes for a dataset (name, type, min, max, and values)
  # Params:
  # +fields+:: The list of fields to the get the attributes for
  # +api_table_name+:: The name of the table to select the attributes from
  # +dataset_id+:: The id of the dataset
  def self.get_fields_attributes fields, api_table_name, dataset_id
    query = 'select '
    field_names = []
    fields.select{|f| %w[number date long double].include?(f[:type])}.each do |field|
      field_names << " min(#{field[:name]}) as min_#{field[:name]} , max(#{field[:name]}) as max_#{field[:name]} "
    end
    query += field_names.join(', ')
    query += " from #{api_table_name}"

    number_dataset = get_filtered_dataset dataset_id, query

    string_datasets = {}
    fields.select {|f| f[:type] == 'string'}.each do |field|
      query = "select count(*) from #{api_table_name} group by #{field[:name]}"
      string_datasets[field[:name]] = get_filtered_dataset(dataset_id, query)
    end

    fields.each do |field|
      case field[:type]
        when 'number', 'date', 'long', 'double'
          field[:min] = number_dataset['data'][0]["min_#{field[:name]}"]
          field[:max] = number_dataset['data'][0]["max_#{field[:name]}"]
        when 'string'
          field[:values] = string_datasets[field[:name]]['data'].map{|x| x[field[:name]]}
      end
    end
    fields
  end
end
