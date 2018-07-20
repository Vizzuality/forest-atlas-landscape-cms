class AddHtmlToMapVersions < ActiveRecord::Migration[5.0]
  def change
    add_column :map_versions, :html, :text
  end
end
