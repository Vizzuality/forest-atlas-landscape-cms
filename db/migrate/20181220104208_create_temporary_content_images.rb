class CreateTemporaryContentImages < ActiveRecord::Migration[5.0]
  def change
    create_table :temporary_content_images do |t|
      t.timestamps
    end

    add_attachment :temporary_content_images, :image
  end
end
