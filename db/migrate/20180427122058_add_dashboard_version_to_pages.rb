class AddDashboardVersionToPages < ActiveRecord::Migration[5.0]
  def change
    add_column :pages, :dashboard_version, :integer, :default => 1
  end
end
