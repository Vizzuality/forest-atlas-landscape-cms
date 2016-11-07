class DatasetService

  @conn ||= Faraday.new(:url => ENV.fetch("API_URL")) do |faraday|
    faraday.request :url_encoded
    faraday.response :logger
    faraday.adapter Faraday.default_adapter
  end

  def self.get_datasets
    # TODO: Change the app to FA's name.
    datasetRequest = @conn.get '/dataset' , {:app => 'prep'}
    datasetsJSON = JSON.parse datasetRequest.body
    datasets = []

    datasetsJSON['data'].each do |data|
      dataset = Dataset.new data
      datasets.push dataset
    end

    datasets
  end

  def self.get_fields dataset_id
    fieldsRequest = @connect.get "/fields/#{dataset_id}"
    fieldsJSON = JSON.parse fieldsRequest.body

    fields = []
    fieldsJSON['data'].each do |data|
      fields << Field.new(data)
    end

    fields
  end
end
