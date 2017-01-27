class Management::ProfileController < ManagementController

  def edit
    @breadcrumbs << {name: 'User Profile'}
    @user = current_user
  end

  def update

  end
end
