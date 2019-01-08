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
#  attribution_link   :text
#  attribution_label  :text
#

class SiteSetting < ApplicationRecord
  belongs_to :site, inverse_of: :site_settings
  validates_presence_of :site
  validates :attribution_link, format: { with: URI.regexp }, if: 'attribution_link.present?'
  after_update :update_terms_of_service_page, if: Proc.new { |ss|
    ss.name == 'hosting_organization' && ss.value.present?
  }

  NAMES = %w[
    logo_image main_image alternative_image favico color flag
    default_site_language
    translate_english translate_spanish translate_french translate_georgian
    pre_footer analytics_key keywords contact_email_address
    hosting_organization transifex_api_key
  ]
  MAX_COLORS = 5

  # Makes sure the same site doesn't have a repeated setting
  validates_uniqueness_of :name, scope: :site_id, unless: Proc.new { |setting| setting.name.eql? 'main_image' }
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

  def self.main_images(site_id)
    SiteSetting.where(name: 'main_image', site_id: site_id)
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

  def self.default_site_language(site_id)
    SiteSetting.find_by(name: 'default_site_language', site_id: site_id)
  end

  def self.translate_english(site_id)
    SiteSetting.find_by(name: 'translate_english', site_id: site_id)
  end

  def self.translate_spanish(site_id)
    SiteSetting.find_by(name: 'translate_spanish', site_id: site_id)
  end

  def self.translate_french(site_id)
    SiteSetting.find_by(name: 'translate_french', site_id: site_id)
  end

  def self.translate_georgian(site_id)
    SiteSetting.find_by(name: 'translate_georgian', site_id: site_id)
  end

  def self.pre_footer(site_id)
    SiteSetting.find_by(name: 'pre_footer', site_id: site_id)
  end

  def self.analytics_key(site_id)
    SiteSetting.find_by(name: 'analytics_key', site_id: site_id)
  end

  def self.keywords(site_id)
    SiteSetting.find_by(name: 'keywords', site_id: site_id)
  end

  def self.contact_email_address(site_id)
    SiteSetting.find_by(name: 'contact_email_address', site_id: site_id)
  end

  def self.hosting_organization(site_id)
    SiteSetting.find_by(name: 'hosting_organization', site_id: site_id)
  end

  def self.transifex_api_key(site_id)
    SiteSetting.find_by(name: 'transifex_api_key', site_id: site_id)
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
    unless site.site_settings.exists?(name: 'logo_image')
      site.site_settings.new(name: 'logo_image', value: '', position: 2)
      site.site_settings.new(name: 'main_image', value: '', position: 5)
      site.site_settings.new(name: 'alternative_image', value: '', position: 6)
      site.site_settings.new(name: 'favico', value: '', position: 3)
      site.site_settings.new(name: 'flag', value: '#000000', position: 4) if site.site_template.name == 'Forest Atlas'
    end
  end

  # Creates the color setting for a site
  def self.create_site_settings site
    unless site.site_settings.exists?(name: 'translate_english')
      site.site_settings.new(name: 'translate_english', value: '1', position: 7)
      site.site_settings.new(name: 'translate_spanish', value: '1', position: 8)
      site.site_settings.new(name: 'translate_french', value: '1', position: 9)
      site.site_settings.new(name: 'pre_footer', value: '', position: 10)
      site.site_settings.new(name: 'analytics_key', value: '', position: 11)
      site.site_settings.new(name: 'keywords', value: '', position: 12)
      site.site_settings.new(name: 'contact_email_address', value: '', position: 13)
      site.site_settings.new(name: 'hosting_organization', value: '', position: 14)
      site.site_settings.new(name: 'default_site_language', value: 'fr', position: 15)
      site.site_settings.new(name: 'translate_georgian', value: '1', position: 16)
      site.site_settings.new(name: 'transifex_api_key', value: '', position: 17)
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

  def update_terms_of_service_page
    site.try(:update_terms_of_service_page)
  end
end
