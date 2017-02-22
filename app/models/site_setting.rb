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
  belongs_to :site, inverse_of: :site_settings
  validates_presence_of :site
  validates :attribution_link, format: { with: URI.regexp }, if: 'attribution_link.present?'

  NAMES = %w[logo_image main_image alternative_image favico color flag]
  MAX_COLORS = 5

  # Makes sure the same site doesn't have a repeated setting
  validates_uniqueness_of :name, scope: :site_id
  # All settings have mandatory values, except for images and flag
  validates :value, presence: :true, if: :has_required_value?
  # All fields must have a name and position
  validates :name, :position, presence: :true
  validates :name, inclusion: { in: NAMES }

  has_attached_file :image,
                    styles: {thumb: '100x100#'},
                    default_url: ':style/missing.png'

  validate :validate_image

  validates_attachment :image,
                       content_type: {content_type: %w[image/jpg image/jpeg image/png]},
                       styles: {thumb: '100x100#'}


  def self.logo_background(site_id)
    SiteSetting.find_by(name: 'logo_background', site_id: site_id)
  end

  def self.logo_image(site_id)
    SiteSetting.find_by(name: 'logo_image', site_id: site_id)
  end

  def self.main_image(site_id)
    SiteSetting.find_by(name: 'main_image', site_id: site_id)
  end

  def self.alternative_image(site_id)
    SiteSetting.find_by(name: 'alternative_image', site_id: site_id)
  end

  def self.favico(site_id)
    SiteSetting.find_by(name: 'favico', site_id: site_id)
  end

  def self.color(site_id)
    SiteSetting.find_by(name: 'color', site_id: site_id)
  end

  def self.flag_colors(site_id)
    SiteSetting.find_by(name: 'flag', site_id: site_id)
  end

  def flag_colors
    value.split(' ')
  end

  def flag_colors=(colors)
    write_attribute(:value, colors.join(' '))
  end

  # Creates the color setting for a site
  def self.create_color_settings site
    if site.site_settings.length < 1
      site.site_settings.new(name: 'color', value: '#000000', position: 1)
    end
  end

  # Creates all the additional settings for a site
  def self.create_additional_settings site
    unless site.site_settings.length > 1
      site.site_settings.new(name: 'logo_image', value: '', position: 2)
      site.site_settings.new(name: 'main_image', value: '', position: 5)
      site.site_settings.new(name: 'alternative_image', value: '', position: 6)
      site.site_settings.new(name: 'favico', value: '', position: 3)
      site.site_settings.new(name: 'flag', value: '#000000', position: 4) if site.site_template.name == 'Forest Atlas'
    end
  end

  private

  def validate_image
    begin
      if name == 'logo_image' && image.blank? && site.site_template.name == 'Forest Atlas'
        errors.add :key, 'You must update an image for the ' + name
        return false
      else
        return true
      end
    rescue # If the site has no template
      return true
    end
  end

  def has_required_value?
    %w[color].include?(name)
  end
end
