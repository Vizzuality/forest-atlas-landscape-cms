class UserService
  @conn ||= Faraday.new(url: ENV.fetch('API_URL')) do |faraday|
    faraday.request :url_encoded
    faraday.response :logger
    faraday.adapter Faraday.default_adapter
  end

  def self.get(token, email)
    res = @conn.get do |req|
      req.url "/auth/user?email=#{email.gsub('+', '%5C%2B')}&app=all"
      req.headers['Authorization'] = "Bearer #{token}"
      req.headers['Content-Type'] = 'application/json'
    end

    JSON.parse res.body
  end

  def self.create(token, email, role, callback_url)
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
          \"callbackUrl\": \"#{callback_url}\"
        }"
    end

    res_json = JSON.parse res.body
    error = res_json.dig('errors', 0, 'detail')
    {valid: res.success?, error: error}
  end

  def self.update(token, id, existing_apps)
    res = @conn.patch do |req|
      req.url "/auth/user/#{id}"
      req.headers['Authorization'] = "Bearer #{token}"
      req.headers['Content-Type'] = 'application/json'
      req.body = {
        extraUserData: {
          apps: existing_apps.push('forest-atlas').uniq
        },
        role: 'MANAGER'
      }.to_json
    end

    res_json = JSON.parse res.body
    error = res_json.dig('errors', 0, 'detail')
    {valid: res.success?, error: error}
  end

  # Updated the name of the user
  # Params
  # +token+:: The token to authenticate at the API
  # +id+:: The user id at the API
  def self.delete(token, id)
    res = @conn.delete do |req|
      req.url "/auth/user/#{id}"
      req.headers['Authorization'] = "Bearer #{token}"
      req.headers['Content-Type'] = 'application/json'
    end

    res_json = JSON.parse res.body
    error = res_json.dig('errors', 0, 'detail')
    {valid: res.success?, error: error}
  end
end
