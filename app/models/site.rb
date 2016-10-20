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
  belongs_to :site_template, optional: :true
  has_many :routes
  has_many :site_pages
  has_many :user_site_associations, dependent: :destroy
  has_many :users, through: :user_site_associations
  has_many :context_sites
  has_many :contexts, through: :context_sites
  has_many :site_settings, dependent: :destroy

  accepts_nested_attributes_for :site_settings
  accepts_nested_attributes_for :users

  validates_presence_of :name, :routes, if: -> { required_for_step? :name }
  validates_presence_of :users, if: -> { required_for_step? :users }

  # TODO: Put this back in. Solve the backbone problem and put this back in.
  # validates_presence_of :routes, if: -> { required_for_step? :name }
  validates_presence_of :site_template_id, if: -> { required_for_step? :style }

  before_validation :generate_slug
  after_create :create_context
  after_save :update_routes
  after_create :create_template_content

  cattr_accessor :form_steps do
    %w[name users style settings finish]
  end
  attr_accessor :form_step

  def required_for_step?(step)
    # All fields are required if no form step is present
    return true if form_step.nil?

    # All fields from previous steps are required if the
    # step parameter appears before or we are on the current step
    return true if self.form_steps.index(step.to_s) <= self.form_steps.index(form_step)
  end

  def update_routes
    DynamicRouter.update_routes_for_site self
  end

  def create_template_content
    SiteCreator.create_site_content self
  end

  def create_context
    return nil unless self.contexts.empty?

    context = Context.create!({name: self.name})
    self.context_sites.create(context_id: context.id, is_site_default_context: true)
  end

  def root
    SitePage.find_by site_id: self.id, uri: ''
  end

  def get_ordered_settings
    settings = site_settings.order :position
    if settings.blank?
      SiteSetting.new site_id: id, name: 'background', value: '', position: 1
      SiteSetting.new site_id: id, name: 'logo', value: '', position: 2
      SiteSetting.new site_id: id, name: 'color', value: '', position: 3
      SiteSetting.new site_id: id, name: 'flag', value: '', position: 4

      settings = site_settings.order :position
    end
    settings
  end

  private

  def generate_slug
    write_attribute(:slug, self.name.parameterize)
  end
end
