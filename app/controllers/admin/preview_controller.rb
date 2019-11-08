class Admin::PreviewController < AdminController
  before_action :ensure_only_admin_user
  before_action :set_user, only: :destroy
  before_action :acknowledge_admin

  def index
    respond_to do |format|
      format.html { render :index }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, {site_ids: []})
  end

  def acknowledge_admin
    @admin = current_user.admin
  end
end
