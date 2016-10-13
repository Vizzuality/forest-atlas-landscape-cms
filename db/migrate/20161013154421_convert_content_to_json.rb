class ConvertContentToJson < ActiveRecord::Migration[5.0]
  def change
    remove_column :pages, :content_js
    remove_column :pages, :content
    add_column :pages, :content, :json
  end
end
