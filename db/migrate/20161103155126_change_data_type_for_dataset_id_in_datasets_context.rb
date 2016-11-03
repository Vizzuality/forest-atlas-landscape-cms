class ChangeDataTypeForDatasetIdInDatasetsContext < ActiveRecord::Migration[5.0]
  def change
    change_column :context_datasets, :dataset_id, :string
  end
end
