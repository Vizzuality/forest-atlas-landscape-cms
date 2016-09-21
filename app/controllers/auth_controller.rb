class AuthController < ApplicationController

  def login
    token = params[:token]

    if token.nil?
      redirect_to_apigateway
    else
      session[:user_token] = token

      connect = Faraday.new(url: "#{ENV['APIGATEWAY_URL']}") do |faraday|
        faraday.request  :url_encoded             # form-encode POST params
        faraday.response :logger                  # log requests to STDOUT
        faraday.adapter  Faraday.default_adapter  # make requests with Net::HTTP
      end

      connect.authorization :Bearer, session[:user_token]
      response = connect.get('/auth/checkLogged');

      session[:current_user] = response.body

      redirect_to admin_sites_path # TODO: This has to be to the kind of user
    end
  end

  def logout
    session.delete(:user_token)
    session.delete(:current_user)
    redirect_to_apigateway
  end

end
