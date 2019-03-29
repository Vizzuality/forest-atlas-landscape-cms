# == Schema Information
#
# Table name: temporary_content_images
#
#  id                 :integer          not null, primary key
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  image_file_name    :string
#  image_content_type :string
#  image_file_size    :integer
#  image_updated_at   :datetime
#

class TemporaryContentImage < ApplicationRecord
  has_attached_file :image, styles: { cover: '1280x>', thumb: '800x>' }
  validates_attachment_content_type :image, content_type: %r{^image\/.*}

  def self.remove_old
    where('created_at < ?', 1.day.ago).each(&:destroy)
  end
end
