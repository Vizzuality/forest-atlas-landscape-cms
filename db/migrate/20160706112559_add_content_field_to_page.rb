class AddContentFieldToPage < ActiveRecord::Migration[5.0]
  def change
    add_column :pages, :content, :text
  end
end
