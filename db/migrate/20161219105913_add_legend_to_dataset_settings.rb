class AddLegendToDatasetSettings < ActiveRecord::Migration[5.0]
  def change
    add_column :dataset_settings, :legend, :json
  end
end
