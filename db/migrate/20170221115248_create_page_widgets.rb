class CreatePageWidgets < ActiveRecord::Migration[5.0]
  def change
    create_table :page_widgets do |t|
      t.references :page, foreign_key: true
      t.references :widget, foreign_key: true, index: true
    end
  end
end
