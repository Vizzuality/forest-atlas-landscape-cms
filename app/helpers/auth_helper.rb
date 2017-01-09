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
end
