# == Schema Information
#
# Table name: site_settings
#
#  id                 :integer          not null, primary key
#  site_id            :integer
#  name               :string           not null
#  value              :string
#  position           :integer          not null
#  image_file_name    :string
#  image_content_type :string
#  image_file_size    :integer
#  image_updated_at   :datetime
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

class SiteSetting < ApplicationRecord
  belongs_to :site

  NAMES = %w[theme background logo color flag]
  THEMES = [1, 2]
  MAX_COLORS = 5

  # Makes sure the same site doesn't have a repeated setting
  validates_uniqueness_of :name, scope: :site_id
  # All settings have mandatory values, except for images and flag
  validates :value, presence: :true, if: :has_required_value?
  # All fields must have a name and position
  validates :name, :position, presence: :true
  validates :name, inclusion: { in: NAMES }
  validates :value, inclusion: { in: THEMES } if name == 'theme'

  has_attached_file :image,
                    styles: lambda { |attachment| { thumb: (attachment.instance.name == 'logo' ? '100x100#' : '500x200#') }},
                    default_url: ':style/missing.png'

  validate :validate_image

  validates_attachment :image,
                       content_type: {content_type: %w[image/jpg image/jpeg image/png]},
                       styles: lambda {|attachment| { thumb: (attachment.instance.value == 'logo' ? '100x100#' : '500x200#') }}


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

  private

  def validate_image
    if (name == 'background' || name == 'logo') && image.blank?
      errors.add :key, 'You must update an image for the ' + name
      return false
    else
      return true
    end
  end

  def has_required_value?
    %w[theme color].include?(name)
  end
end
