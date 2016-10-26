class ManagementController < ActionController::Base
  before_action :authenticate_user!
  layout 'management'

  def authenticate_user_for_site!
    return true if current_user.admin?
    raise ScriptError, 'Expected site to be defined to validate authorization, but none found' if @site.nil?

    raise Exception, 'User not authorized to access this site' unless @site.users.exists?(current_user)
  end
end
