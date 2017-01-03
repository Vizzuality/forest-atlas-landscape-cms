class AuthController < ApplicationController
  def login
    token = params[:token]

    return redirect_to_api_gateway_login if token.nil?

    session[:user_token] = token

    connect = Faraday.new(url: "#{ENV['API_URL']}") do |faraday|
      faraday.request :url_encoded # form-encode POST params
      faraday.response :logger # log requests to STDOUT
      faraday.adapter Faraday.default_adapter # make requests with Net::HTTP
    end

    connect.authorization :Bearer, session[:user_token]
    response = connect.get('/auth/check-logged');

    if !response.status.to_s.match(/^20/)
      session.delete(:user_token)
      return redirect_to_api_gateway_login
    end

    session[:current_user] = JSON.parse response.body
    session[:api_validation_ttl] = Time.now + Rails.configuration.session_revalidate_timer

    # TODO: Validate the user type
    redirect_url = session.delete(:return_to)

    if redirect_url and !is_login_redirect?(redirect_url)
      redirect_to redirect_url
    else # TODO: The user should be redirected to the admin or management page, according to his role
      redirect_to admin_sites_path
    end
  end

  def logout
    session.delete(:user_token)
    session.delete(:current_user)
    redirect_to_api_gateway_logout
  end

  private

  def is_login_redirect?(params)
    return (params[:controller].eql?('auth') and params[:action].eql?('login'))
  end
end
