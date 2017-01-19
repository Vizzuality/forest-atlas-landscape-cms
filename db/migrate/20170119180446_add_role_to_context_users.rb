class AddRoleToContextUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :context_users, :role, :integer, default: 1
  end
end
