class AuthController < ApplicationController
  def login
    token = params[:token]

    redirect_to_api_gateway_login and return if token.blank?

    session[:user_token] = token

    unless ensure_logged_in
      redirect_to_api_gateway_login and return
    end

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
