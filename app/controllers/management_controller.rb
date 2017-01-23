class ManagementController < ActionController::Base
  include ApplicationHelper
  include PermissionsHelper

  before_action :ensure_management_user
  before_action :set_management_base_breadcrumbs
  layout 'management'

  def authenticate_user_for_site!
    raise ScriptError, 'Expected site to be defined to validate authorization, but none found' if @site.nil?

    unless user_can?('access_admin') || (user_can?('access_management') && @site.users.exists?(current_user))
      flash[:error] = 'You do not have permissions to view this page'
      redirect_to :no_permissions
    end
  end

  private

  def ensure_management_user
    ensure_user_can 'access_management'
  end

  def set_management_base_breadcrumbs
    @breadcrumbs = []
  end
end
