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
  belongs_to :site, optional: true

  NAMES = %w[logo_image logo_background color flag]
  MAX_COLORS = 5

  # Makes sure the same site doesn't have a repeated setting
  validates_uniqueness_of :name, scope: :site_id
  # All settings have mandatory values, except for images and flag
  validates :value, presence: :true, if: :has_required_value?
  # All fields must have a name and position
  validates :name, :position, presence: :true
  validates :name, inclusion: { in: NAMES }

  has_attached_file :image,
                    styles: {thumb: '100x100#'}, #lambda { |attachment| { thumb: (attachment.instance.name == 'logo' ? '100x100#' : '500x200#') }},
                    default_url: ':style/missing.png'

  validate :validate_image

  validates_attachment :image,
                       content_type: {content_type: %w[image/jpg image/jpeg image/png]},
                       styles: {thumb: '100x100#'} #lambda {|attachment| { thumb: (attachment.instance.value == 'logo' ? '100x100#' : '500x200#') }}


  def self.logo_background(site_id)
    SiteSetting.where(name: 'logo_background', site_id: site_id)
  end

  def self.logo_image(site_id)
    SiteSetting.where(name: 'logo_image', site_id: site_id)
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
    if name == 'logo_image' && image.blank?
      errors.add :key, 'You must update an image for the ' + name
      return false
    else
      return true
    end
  end

  def has_required_value?
    %w[color].include?(name)
  end
end
