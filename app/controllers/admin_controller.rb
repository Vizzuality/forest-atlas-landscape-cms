class AdminController < ActionController::Base
  include PermissionsHelper
  include SessionHelpers

  # skip_before_action :verify_authenticity_token, raise: false
  before_action :ensure_admin_user
  before_action :set_admin_base_breadcrumbs
  before_action :set_user_gon
  layout 'admin'

  def ensure_only_admin_user
    ensure_user_can 'access_admin_only'
  end

  private

  def ensure_admin_user
    ensure_user_can 'access_admin'

    cookies.encrypted[:current_user_id] = current_user.id
  end

  def set_admin_base_breadcrumbs
    @breadcrumbs = []
  end
end
