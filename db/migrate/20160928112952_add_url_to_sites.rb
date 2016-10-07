class AddUrlToSites < ActiveRecord::Migration[5.0]
  def change
    add_column :sites, :url, :string
  end
end
