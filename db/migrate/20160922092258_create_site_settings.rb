class CreateSiteSettings < ActiveRecord::Migration[5.0]
  def change
    create_table :site_settings do |t|
      t.belongs_to :site, index:true

      t.string :name, null: false
      t.string :value, null: false
      t.integer :position, null: false

      t.attachment :image

      t.timestamps
    end

    add_index :site_settings, [:site_id, :name], unique: true
  end
end
