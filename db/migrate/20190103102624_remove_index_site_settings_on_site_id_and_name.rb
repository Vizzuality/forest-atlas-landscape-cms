class RemoveIndexSiteSettingsOnSiteIdAndName < ActiveRecord::Migration[5.0]
  def change
    remove_index :site_settings, column: [:site_id, :name]
  end
end
