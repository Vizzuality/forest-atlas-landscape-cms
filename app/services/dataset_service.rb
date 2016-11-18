class DatasetService

  @conn ||= Faraday.new(:url => ENV.fetch("API_URL")) do |faraday|
    faraday.request :url_encoded
    faraday.response :logger
    faraday.adapter Faraday.default_adapter
  end

  def self.get_datasets
    # TODO: Change the app to FA's name.
    datasetRequest = @conn.get '/dataset' , {:app => 'prep', 'page[number]': '1', 'page[size]': '10000'}
    datasetsJSON = JSON.parse datasetRequest.body
    datasets = []

    datasetsJSON['data'].each do |data|
      dataset = Dataset.new data
      datasets.push dataset
    end

    datasets
  end

  def self.get_fields(dataset_id)
    fieldsRequest = @conn.get "/fields/#{dataset_id}"
    fieldsJSON = JSON.parse fieldsRequest.body

    fields = []
    fieldsJSON['fields'].each do |data|
      fields << Field.new(data)
    end
    fields
  end

  def self.get_filtered_dataset(dataset_id, query)
    full_query = "/query/#{dataset_id}?sql=#{query}"

    filteredRequest = @conn.get full_query
    JSON.parse filteredRequest.body
  end

  def self.get_dataset(dataset_id)
    request = @conn.get "/dataset/#{dataset_id}"
    JSON.parse request
  end
end
