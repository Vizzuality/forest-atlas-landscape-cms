# == Schema Information
#
# Table name: pages
#
#  id           :integer          not null, primary key
#  site_id      :integer
#  name         :string
#  description  :string
#  uri          :string
#  url          :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  content_type :integer
#  type         :text
#  enabled      :boolean
#  parent_id    :integer
#  position     :integer
#  content      :json
#  show_on_menu :boolean          default(TRUE)
#

class SitePage < Page
  belongs_to :site
  has_many :routes, through: :site
  has_one :site_template, through: :site
  has_many :users, through: :site
  has_one :dataset_setting, dependent: :destroy, inverse_of: :site_page

  before_create :set_defaults
  before_save :construct_url, if: 'content_type.eql? ContentType::LINK'

  validates :url, uniqueness: {scope: :site}, unless: 'content_type.eql? ContentType::LINK'
  validates_presence_of :site_id
  after_save :update_routes

  # TODO: Add validations for each of the steps

  attr_accessor :form_step

  def form_steps
    steps = nil

    case self.content_type
      when ContentType::OPEN_CONTENT
        steps = { pages: %w[position title type open_content open_content_preview],
                  names: ['Position', 'Title', 'Type', 'Open Content', 'Open Content Preview']}
      when ContentType::ANALYSIS_DASHBOARD
        steps = { pages: %w[position title type dataset filters columns customization preview],
                  names: ['Position', 'Title', 'Type', 'Dataset', 'Filters', 'Columns', 'Customization' 'Preview']}
      when ContentType::DYNAMIC_INDICATOR_DASHBOARD
        steps = { pages: %w[position title type widget dynamic_indicator_dashboard dynamic_indicator_dashboard_preview],
                  names: ['Position', 'Title',  'Type', 'Widget', 'Dynamic Indicator Dashboard', 'Preview']}
      when ContentType::LINK
        steps = { pages: %w[position title type link],
                  names: ['Position', 'Title', 'Type', 'Link']}
      when ContentType::STATIC_CONTENT
        steps = { pages: %w[position title type static_content],
                  names: ['Position', 'Title', 'Type', 'Static Content']}
    end
    steps
  end

  def update_routes
    return if self.content_type.eql? ContentType::LINK
    DynamicRouter.update_routes_for_site_page self
  end

  private
  def construct_url
    if self.content['url']
      old_content = self.content
      unless old_content['url'].starts_with? 'http://', 'https://'
        old_content['url'] = 'http://' + old_content['url']
        self.content = old_content
      end
    end
  end

  # TODO: Temporary fix. This won't be needed when the page creation is merged
  def set_defaults
    self.enabled = false unless self.enabled
    # Put the parent as the root, if it doesn't exist
    unless self.parent_id
      self.parent_id = self.site.root.id if self.site.root
    end
  end
end
