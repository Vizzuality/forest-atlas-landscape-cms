class ArcgisService

  def self.connect(url)
    Faraday.new(url: url) do |faraday|
      faraday.request :url_encoded
      faraday.response :logger, Rails.logger
      faraday.adapter Faraday.default_adapter
    end
  end

  def self.build_metadata(dataset_url)
    begin
      conn = connect(dataset_url)
      response = conn.get
      JSON.parse response.body
    rescue
      {}
    end
  end
end
