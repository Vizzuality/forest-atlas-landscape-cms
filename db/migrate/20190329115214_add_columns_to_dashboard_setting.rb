class AddColumnsToDashboardSetting < ActiveRecord::Migration[5.0]
  def change
    add_column :dashboard_settings, :columns, :string
  end
end
