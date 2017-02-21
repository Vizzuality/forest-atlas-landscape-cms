class AdminController < ActionController::Base
  include PermissionsHelper
  include SessionHelpers

  # skip_before_action :verify_authenticity_token, raise: false
  before_action :ensure_admin_user
  before_action :set_admin_base_breadcrumbs
  before_action :set_gon
  layout 'admin'

  private

  def ensure_admin_user
    ensure_user_can 'access_admin'
  end

  def set_admin_base_breadcrumbs
    @breadcrumbs = []
  end

  def set_gon
    gon.global.admin = if current_user
                         current_user.admin
                       else
                         false
                       end

    gon.global.user = { 'name' => current_user.name, 'profile' => edit_management_profile_path(current_user.id), 'logout' => auth_logout_url } if current_user
  end
end
