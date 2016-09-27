# == Schema Information
#
# Table name: sites
#
#  id               :integer          not null, primary key
#  site_template_id :integer
#  name             :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  slug             :text
#

class Site < ApplicationRecord
  belongs_to :site_template
  has_many :routes
  has_many :site_pages
  has_many :user_site_associations
  has_many :users, through: :user_site_associations
  has_many :context_sites
  has_many :contexts, through: :context_sites
  has_many :site_settings, dependent: :destroy

  accepts_nested_attributes_for :site_settings
  accepts_nested_attributes_for :users

  before_validation :generate_slug
  before_create :create_context
  after_save :update_routes
  after_create :create_template_content

  def update_routes
    DynamicRouter.update_routes_for_site self
  end

  def create_template_content
    SiteCreator.create_site_content self
  end

  def create_context
    return nil unless self.contexts.empty?

    context = Context.create!({name: self.name})
    site_context = ContextSite.create!({context: context, is_site_default_context: true})
    self.context_sites.push(site_context)
  end

  def root
    SitePage.find_by site_id: self.id, uri: ''
  end

  def get_ordered_settings
    settings = site_settings.order :position
    if settings.blank?
      (SiteSetting.new site_id: id, name: 'theme', value: '1', position: 0).save(validate: false)
      (SiteSetting.new site_id: id, name: 'background', value: '', position: 1).save(validate: false)
      (SiteSetting.create site_id: id, name: 'logo', value: '', position: 2).save(validate: false)
      (SiteSetting.create site_id: id, name: 'color', value: '', position: 3).save(validate: false)
      (SiteSetting.create site_id: id, name: 'flag', value: '', position: 4).save(validate: false)

      settings = site_settings.order :position
    end
    settings
  end

  private

  def generate_slug
    write_attribute(:slug, self.name.parameterize)
  end
end
