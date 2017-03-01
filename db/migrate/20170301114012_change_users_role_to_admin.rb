class ChangeUsersRoleToAdmin < ActiveRecord::Migration[5.0]
  def up
  	add_column :users, :admin, :boolean, default: false

  	# Update admin column based on role
  	User.where(role: UserType::ADMIN).update_all(admin: true)

  	remove_column :users, :role
  end

  def down
  	add_column :users, :role, :integer, default: UserType::PUBLISHER
  	User.where(admin: true).update_all role: UserType::ADMIN
    User.where(admin: false).update_all role: UserType::MANAGER
    remove_column :users, :admin
  end
end
