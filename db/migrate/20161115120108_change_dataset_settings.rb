class ChangeDatasetSettings < ActiveRecord::Migration[5.0]

  def up
    add_column :dataset_settings, :default_graphs, :json
    add_column :dataset_settings, :default_map, :json
    add_column :dataset_settings, :api_table_name, :string
    change_column :dataset_settings, :columns_visible, 'json USING CAST (columns_visible as json)'
    change_column :dataset_settings, :columns_changeable, 'json USING CAST (columns_changeable as json)'
    change_column :dataset_settings, :filters, 'json USING CAST (filters as json)'
  end

  def down
    remove_column :dataset_settings, :default_graphs, :json
    remove_column :dataset_settings, :default_map, :json
    remove_column :dataset_settings, :api_table_name, :string
    change_column :dataset_settings, :columns_visible, :string
    change_column :dataset_settings, :columns_changeable, :string
    change_column :dataset_settings, :filters, :string
  end
end
