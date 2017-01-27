class Management::ProfileController < ManagementController
  before_action :get_user

  def edit
    @breadcrumbs << {name: 'User Profile'}
  end

  def update
    @user.name = user_params[:name]
    if @user.save
      # TODO check with the API what do do
      #@user.update_api_name
      redirect_to management_path, notice: 'Name successfully updated'
    else
      render :edit
    end
  end

  private
  def user_params
    params.require(:user).permit(:name)
  end

  def get_user
    @user = current_user
  end
end
