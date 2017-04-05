class RemoveVisibleFromWidgets < ActiveRecord::Migration[5.0]
  def change
    remove_column :widgets, :visible
  end
end
