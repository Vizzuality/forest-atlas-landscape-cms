class DatasetService

  @conn ||= Faraday.new(:url => ENV.fetch("API_URL")) do |faraday|
    faraday.request :url_encoded
    faraday.response :logger
    faraday.adapter Faraday.default_adapter
  end

  def self.get_datasets
    datasetRequest = @conn.get '/datasets', {:app => 'prep'}
    datasetsJSON = JSON.parse datasetRequest.body
    datasets = []

    datasetsJSON.each do |data|
      dataset = Dataset.new
      dataset.attributes = data
      datasets.push dataset
    end

    datasets
  end

end
