class UserService

  @conn ||= Faraday.new(:url => ENV.fetch("API_URL")) do |faraday|
    faraday.request :url_encoded
    faraday.response :logger
    faraday.adapter Faraday.default_adapter
  end

  def self.create(token, email, role, callbackUrl)
    res = @conn.post do |req|
      req.url '/auth/user'
      req.headers['Authorization'] = "Bearer #{token}"
      req.headers['Content-Type'] = 'application/json'
      req.body =
        "{
          \"email\":\"#{email}\",
          \"role\": \"#{role}\",
          \"extraUserData\": {
              \"apps\": [\"forest-atlas\"]
          },
          \"callbackUrl\": \"#{callbackUrl}\"
        }"
    end

    error = ''
    begin
      res_json = JSON.parse res.body
      error = res_json['errors'].first['detail']
    rescue
    end
    {valid: res.success?, error: error}
  end

end
