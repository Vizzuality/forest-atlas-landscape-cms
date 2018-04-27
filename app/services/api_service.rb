class ApiService

  def self.connect
    Faraday.new(url: ENV.fetch('API_URL')) do |faraday|
      faraday.request :url_encoded
      faraday.response :logger, Rails.logger #, bodies: true # Activate this only for specific debugging
      faraday.adapter Faraday.default_adapter
    end
  end
end
