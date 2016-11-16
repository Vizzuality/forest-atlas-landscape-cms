class CreateDatasetSettings < ActiveRecord::Migration[5.0]
  def change
    create_table :dataset_settings do |t|
      t.belongs_to :page, index: true
      t.belongs_to :context
      t.string :dataset_id, null: false
      t.string :filters
      t.string :columns_visible
      t.string :columns_changeable
    end
  end
end
