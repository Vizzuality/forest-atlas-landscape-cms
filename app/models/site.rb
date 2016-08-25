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

  private

  def generate_slug
    write_attribute(:slug, self.name.parameterize)
  end
end
