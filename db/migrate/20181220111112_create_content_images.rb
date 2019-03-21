class CreateContentImages < ActiveRecord::Migration[5.0]
  def change
    create_table :content_images do |t|
      t.timestamps

      t.references :page,
                   foreign_key: {
                     on_delete: :cascade
                   }
    end
    add_attachment :content_images, :image
  end
end
