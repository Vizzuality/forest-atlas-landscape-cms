class AddPageType < ActiveRecord::Migration[5.0]
  def change
    add_column :pages, :type, :text
  end
end
