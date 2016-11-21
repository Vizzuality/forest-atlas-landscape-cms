class ChangeFieldsLastModifiedFromDatasetSetting < ActiveRecord::Migration[5.0]
  def change
    change_column :dataset_settings, :fields_last_modified, :string
  end
end
