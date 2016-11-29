class AuthController < ApplicationController

  def login
    token = params[:token]

    if token.nil?
      redirect_to_apigateway
    else
      session[:user_token] = token

      connect = Faraday.new(url: "#{ENV['API_URL']}") do |faraday|
        faraday.request  :url_encoded             # form-encode POST params
        faraday.response :logger                  # log requests to STDOUT
        faraday.adapter  Faraday.default_adapter  # make requests with Net::HTTP
      end

      connect.authorization :Bearer, session[:user_token]
      response = connect.get('/auth/checkLogged');

      session[:current_user] = response.body

      # TODO: Validate the user type
      redirect_url = session.delete(:return_to)
      if redirect_url
        redirect_to redirect_url
      else # TODO: The user should be redirected to the admin or management page, according to his role
        redirect_to admin_sites_path
      end

    end
  end

  def logout
    session.delete(:user_token)
    session.delete(:current_user)
    redirect_to_apigateway_logout
  end

end
