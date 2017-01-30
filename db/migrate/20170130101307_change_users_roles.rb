class ChangeUsersRoles < ActiveRecord::Migration[5.0]
  def self.up
    # Adds new column
    puts 'Adding column role'
    add_column :users, :role, :integer, default: 3

    puts 'Copying the admin old values'
    # Sets the new column value for the current values
    User.where(admin: true).update_all role: 1
    User.where(admin: false).update_all role: 2

    puts 'Removing the old admin column'
    # Remove old column
    remove_column :users, :admin
  end

  def self.down
    # Adds old column
    add_column :users, :admin, :boolean, default: false

    # Sets the values as they were before
    User.where(role: 1).update_all admin: true
    User.where('role is not 1').update_all admin: false

    # Remove new column
    remove_columns :users, :role
  end
end
