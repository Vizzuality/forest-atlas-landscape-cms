class AdminController < ActionController::Base
  before_action :authenticate_user!
  before_action :ensure_admin_user
  layout 'admin'

  private

  def ensure_admin_user
    unless current_user.admin?
      flash[:error] = "You do not have permissions to view this page"
      redirect_to :no_permissions
    end
  end
end
