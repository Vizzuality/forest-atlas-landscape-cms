class AddCoverImageToPage < ActiveRecord::Migration[5.0]
  def up
    add_attachment :pages, :cover_image
  end

  def down
    remove_attachment :pages, :cover_image
  end
end
