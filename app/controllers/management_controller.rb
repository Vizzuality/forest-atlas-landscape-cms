class ManagementController < ActionController::Base
  include ApplicationHelper
  include PermissionsHelper
  include SessionHelpers

  before_action :ensure_publish_user
  before_action :set_management_base_breadcrumbs
  before_action :set_user_gon
  layout 'management'

  def authenticate_user_for_site!
    raise ScriptError, 'Expected site to be defined to validate authorization, but none found' if @site.nil?

    unless user_can?('access_admin') || (user_can?('access_management') || (user_can?('access_publish')) \
      && @site.users.exists?(current_user.id))
      flash[:error] = 'You do not have permissions to view this page'
      redirect_to :no_permissions
    end
  end

  private

  def ensure_publish_user
    ensure_user_can 'access_publish'
  end

  def ensure_management_user
    ensure_user_can 'access_management'
  end

  def set_management_base_breadcrumbs
    @breadcrumbs = []
  end
end
