class RemoveCkEditor < ActiveRecord::Migration[5.0]
  def change
    drop_table :ckeditor_assets
  end
end
