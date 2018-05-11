class Admin::UsersController < AdminController
  before_action :set_user, only: :destroy

  # GET /users
  # GET /users.json
  def index
    @users = User.order(params[:order] || 'created_at ASC')

    @formattedUsers = @users.map do |user|
      {
        'name' => {'value' => user.name, 'searchable' => true, 'sortable' => true},
        'email' => {'value' => user.email, 'searchable' => true, 'sortable' => true},
        'role' => {'value' => (user.admin ? User::ADMIN_ROLE_NAME : User::NON_ADMIN_ROLE_NAME), 'searchable' => true, 'sortable' => true},
        'sites' => {'value' => !user.admin ? user.sites.map{|x| x.name} : nil, 'searchable' => true, 'sortable' => true},
        # 'edit' => {'value' => edit_admin_user_user_step_path(user_id: user.id, id: 'identity'), 'method' => 'get'},
        'delete' => {'value' => admin_user_path(user), 'method' => 'delete'}
      }
    end

    gon.users = @formattedUsers;

    respond_to do |format|
      format.html { render :index }
      format.json { render json: @users }
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to admin_users_url, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
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
end
