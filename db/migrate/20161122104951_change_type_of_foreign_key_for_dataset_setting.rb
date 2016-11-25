class ChangeTypeOfForeignKeyForDatasetSetting < ActiveRecord::Migration[5.0]
  def change
    rename_column :dataset_settings, :page_id, :site_page_id
  end
end
