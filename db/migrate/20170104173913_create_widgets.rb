class CreateWidgets < ActiveRecord::Migration[5.0]
  def change
    create_table :widgets do |t|
      t.string :dataset_id
      t.string :api_table_name
      t.json :filters
      t.string :visualization
      t.timestamp :fields_last_modified
      t.json :legend
      t.json :columns
      t.string :name
      t.string :description
    end
  end
end
