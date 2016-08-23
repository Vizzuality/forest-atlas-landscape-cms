class AddSlugToSite < ActiveRecord::Migration[5.0]
  def change
    add_column :sites, :slug, :text
  end
end
