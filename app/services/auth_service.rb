class AuthService
  @conn ||= Faraday.new(url: ENV.fetch('API_URL')) do |faraday|
    faraday.request :url_encoded
    faraday.response :logger
    faraday.adapter Faraday.default_adapter
  end

  def self.login(email, password)
    res = @conn.post do |req|
      req.url '/auth/login'
      req.headers['Content-Type'] = 'application/json'
      body = {email: email, password: password}
      req.body = body.to_json
    end

    JSON.parse res.body
  end
end
