class ApplicationController < ActionController::Base
  include AuthHelper

  protect_from_forgery with: :exception

  layout :layout_by_resource

  before_action :set_current_user

  protected

  def layout_by_resource
    if @current_user && !self.is_a?(SitePageController) || action_name == 'no_permissions'
      'admin'
    else
      'application'
    end
  end

  def json_request?
    request.format.json?
  end

  def set_current_user
    @current_user = session[:current_user] || nil
  end
end
