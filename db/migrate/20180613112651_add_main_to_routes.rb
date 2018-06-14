class AddMainToRoutes < ActiveRecord::Migration[5.0]
  def change
    add_column :routes, :main, :boolean, default: false
  end
end
