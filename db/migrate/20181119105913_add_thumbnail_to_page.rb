class AddThumbnailToPage < ActiveRecord::Migration[5.0]
  def up
    add_attachment :pages, :thumbnail
  end

  def down
    remove_attachment :pages, :thumbnail
  end
end
