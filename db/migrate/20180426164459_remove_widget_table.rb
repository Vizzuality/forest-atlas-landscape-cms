class RemoveWidgetTable < ActiveRecord::Migration[5.0]
  def up

    # Page Widgets
    remove_foreign_key :page_widgets, :widgets
    change_column :page_widgets, :widget_id, :string

    drop_table :widgets

  end

  def down
    create_table 'widgets', force: :cascade do |t|
      t.string   'dataset_id'
      t.string   'api_table_name'
      t.json     'filters'
      t.string   'visualization'
      t.datetime 'fields_last_modified'
      t.json     'legend'
      t.json     'columns'
      t.string   'name'
      t.string   'description'
    end

    change_column :page_widgets, :widget_id, :integer

    add_foreign_key "page_widgets", "widgets"
  end
end
