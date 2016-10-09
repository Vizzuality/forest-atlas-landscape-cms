class AddEnabledToPages < ActiveRecord::Migration[5.0]
  def change
    add_column :pages, :enabled, :bool
  end
end
