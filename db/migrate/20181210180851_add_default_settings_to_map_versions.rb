class AddDefaultSettingsToMapVersions < ActiveRecord::Migration[5.0]
  def change
    add_column :map_versions, :default_settings, :jsonb
  end
end
