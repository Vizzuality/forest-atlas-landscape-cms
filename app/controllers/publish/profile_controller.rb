class Publish::ProfileController < PublishController
  before_action :get_user

  def edit
    @breadcrumbs << {name: 'User Profile'}
  end

  def update
    if params['REMOVE'] == 'yes'
      @user.delete_from_api(session[:user_token], session[:current_user]['id'])
      @user.destroy!
      redirect_to auth_logout_path
      return
    end

    @user.name = user_params[:name]
    if @user.save
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
