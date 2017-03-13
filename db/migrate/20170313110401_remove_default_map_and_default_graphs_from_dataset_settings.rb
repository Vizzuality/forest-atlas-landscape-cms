class RemoveDefaultMapAndDefaultGraphsFromDatasetSettings < ActiveRecord::Migration[5.0]
  def change
    remove_column :dataset_settings, :default_map
    remove_column :dataset_settings, :default_graphs
  end
end
