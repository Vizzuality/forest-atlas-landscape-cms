class AdminController < ActionController::Base
  include PermissionsHelper

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
  end
end
