class AddTimestampToDatasetSettings < ActiveRecord::Migration[5.0]
  def change
    add_column :dataset_settings, :fields_last_modified, :timestamp
  end
end
