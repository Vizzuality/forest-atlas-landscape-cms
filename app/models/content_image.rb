# == Schema Information
#
# Table name: content_images
#
#  id                 :integer          not null, primary key
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  page_id            :integer
#  image_file_name    :string
#  image_content_type :string
#  image_file_size    :integer
#  image_updated_at   :datetime
#

class ContentImage < ApplicationRecord
  belongs_to :site_page, foreign_key: :page_id

  has_attached_file :image, styles: { cover: '1280x>', thumb: '110x>' }
  validates_attachment_content_type :image, content_type: %r{^image\/.*}

  def self.create_from_base64(page_id, base64)
    content_image = ContentImage.new
    content_image.page_id = page_id
    image = Paperclip.io_adapters.for(base64)
    image.original_filename = Time.now.to_i.to_s + image.content_type.gsub('image/', '.')
    content_image.image = image
    content_image.save!
    content_image.image.url
  end
end
