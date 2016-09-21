class AdminController < ActionController::Base

  include ApplicationHelper

 # skip_before_action :verify_authenticity_token, raise: false
  before_action :ensure_admin_user
  layout 'admin'


  private

  def ensure_admin_user
    ensure_user_type 'admin'
  end

end
