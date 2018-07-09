class CreateDashboardSettings < ActiveRecord::Migration[5.0]
  def change
    create_table :dashboard_settings do |t|
      t.belongs_to :page
      t.string :widget_id
      t.string :dataset_id
      t.json :content_top
      t.json :content_bottom

      t.timestamps
    end
  end
end
