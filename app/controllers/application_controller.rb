class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  layout :layout_by_resource

  before_action :set_current_user

  def redirect_to_apigateway
    redirect_to "#{ENV['API_URL']}/auth?callbackUrl=#{auth_login_url}&token=true"
  end

  def redirect_to_apigateway_logout
    redirect_to "#{ENV['API_URL']}/auth/logout?callbackUrl=#{auth_login_url}"
  end

  def jwt_authentication
    unless session.key?('user_token')
      redirect_to_apigateway
    end
  end


  protected

  def layout_by_resource
    if @current_user && !self.is_a?(SitePageController)
      "admin"
    else
      "application"
    end
  end

  def json_request?
    request.format.json?
  end

  def set_current_user
    @current_user = session[:current_user] || nil
  end
end
