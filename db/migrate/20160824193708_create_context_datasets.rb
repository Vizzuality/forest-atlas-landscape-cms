class CreateContextDatasets < ActiveRecord::Migration[5.0]
  def change
    create_table :context_datasets do |t|
      t.boolean :is_confirmed
      t.boolean :is_dataset_default_context

      t.belongs_to :context, index: true
      t.belongs_to :dataset, index: true

      t.timestamps
    end
  end
end
