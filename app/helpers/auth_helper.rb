module AuthHelper
  def redirect_to_api_gateway_login
    params.permit!
    session[:return_to] = params
    #TODO: Should this be redirect_to and return?
    redirect_to "#{ENV['API_URL']}/auth?callbackUrl=#{auth_login_url}&token=true"
  end

  def redirect_to_api_gateway_logout
    redirect_to "#{ENV['API_URL']}/auth/logout?callbackUrl=#{auth_login_url}"
  end

  def jwt_authentication
    unless session.key?('user_token')
      redirect_to_api_gateway_login
    end
  end

  def ensure_logged_in
    connect = Faraday.new(url: "#{ENV['API_URL']}") do |faraday|
      faraday.request :url_encoded # form-encode POST params
      faraday.response :logger # log requests to STDOUT
      faraday.adapter Faraday.default_adapter # make requests with Net::HTTP
    end
    connect.authorization :Bearer, session[:user_token]
    response = connect.get('/auth/check-logged')
    if !response.success?
      session.delete(:user_token)
      session.delete(:current_user)
      session.delete(:api_validation_ttl)
      false
    else
      user_data = JSON.parse response.body
      session[:current_user] = user_data.symbolize_keys!
      session[:api_validation_ttl] = Time.now + Rails.configuration.session_revalidate_timer
      true
    end
  end
end
