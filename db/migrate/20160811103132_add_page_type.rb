class AddPageType < ActiveRecord::Migration[5.0]
  def change
    add_column :pages, :page_type, :text
  end
end
