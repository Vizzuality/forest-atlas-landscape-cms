class AddMenuOptionsToPages < ActiveRecord::Migration[5.0]
  def change
    add_column :pages, :show_on_menu, :boolean, :default => true
  end
end
