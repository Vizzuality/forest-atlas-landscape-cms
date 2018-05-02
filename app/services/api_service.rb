class ApiService

  def self.connect
    Faraday.new(url: ENV.fetch('API_URL')) do |faraday|
      faraday.request :url_encoded
      faraday.response :logger, Rails.logger #, bodies: true # Activate this only for specific debugging
      faraday.adapter Faraday.default_adapter
    end
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
end
