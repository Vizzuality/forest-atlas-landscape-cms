class AddContentJsToPages < ActiveRecord::Migration[5.0]
  def change
    add_column :pages, :content_js, :string
  end
end
