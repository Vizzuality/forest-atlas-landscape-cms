class ManagementController < ActionController::Base
  include ApplicationHelper
  include PermissionsHelper

  before_action :ensure_management_user
  layout 'management'

  def authenticate_user_for_site!
    return true if user_can?('access_management')
    raise ScriptError, 'Expected site to be defined to validate authorization, but none found' if @site.nil?

    raise Exception, 'User not authorized to access this site' unless @site.users.exists?(current_user)
  end

  def ensure_management_user
    ensure_user_can 'access_management'
  end
end
