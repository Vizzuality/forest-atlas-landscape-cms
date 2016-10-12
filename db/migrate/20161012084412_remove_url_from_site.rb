class RemoveUrlFromSite < ActiveRecord::Migration[5.0]
  def change
    remove_column :sites, :url
  end
end
