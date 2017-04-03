class AddVisibleToWidgets < ActiveRecord::Migration[5.0]
  def change
    add_column :widgets, :visible, :boolean, default: true
  end
end
