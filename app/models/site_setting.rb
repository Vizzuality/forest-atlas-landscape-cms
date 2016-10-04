# == Schema Information
#
# Table name: site_settings
#
#  id                                           :integer          not null, primary key
#  name                                         :string           not null
#  value                                        :string           not null
#  position                                     :integer          not null
#  updated_at                                   :datetime         not null
#  image_file_name                              :string
#  image_content_type"                          :string
#  image_file_size                              :integer
#  image_updated_at                             :datetime
#
# index_site_settings_on_site_id_and_name       :index            unique [:site_id, :name]
#

class SiteSetting < ApplicationRecord
  belongs_to :site

  NAMES = %w[theme background logo color flag]
  THEMES = [1, 2]
  MAX_COLORS = 5

  validates_uniqueness_of :name, scope: :site_id
  validates :name, :value, :position, presence: :true
  validates :name, inclusion: { in: NAMES }
  validates :value, inclusion: { in: THEMES } if name == 'theme'
  validates :value, length: { maximum: MAX_COLORS } if name == 'flag_colors'

  has_attached_file :image #, default_url: '/assets/config/images/no_img.jpg'
  validates_attachment_content_type :image, content_type: %w[image/jpg image/jpeg image/png] if (name == 'logo' || name == 'background')

  def self.theme(site_id)
    SiteSetting.where(name: 'theme', site_id: site_id)
  end

  def self.background(site_id)
    SiteSetting.where(name: 'background', site_id: site_id)
  end

  def self.logo(site_id)
    SiteSetting.where(name: 'logo', site_id: site_id)
  end

  def self.color(site_id)
    SiteSetting.where(name: 'color', site_id: site_id)
  end

  def self.flag_colors(site_id)
    SiteSetting.where(name: 'flag', site_id: site_id)
  end

  def flag_colors
    value.split(' ')
  end

  def flag_colors=(colors)
    write_attribute(:value, colors.join(' '))
  end
end
