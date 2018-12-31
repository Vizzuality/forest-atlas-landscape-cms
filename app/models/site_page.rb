# == Schema Information
#
# Table name: pages
#
#  id                     :integer          not null, primary key
#  site_id                :integer
#  name                   :string
#  description            :string
#  uri                    :string
#  url                    :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  content_type           :integer
#  type                   :text
#  enabled                :boolean          default(FALSE)
#  parent_id              :integer
#  position               :integer
#  content                :json
#  show_on_menu           :boolean          default(TRUE)
#  page_version           :integer          default(1)
#  thumbnail_file_name    :string
#  thumbnail_content_type :string
#  thumbnail_file_size    :integer
#  thumbnail_updated_at   :datetime
#

class SitePage < Page
  include PgSearch
  pg_search_scope :search,
                  associated_against: {
                    tags: :value
                  },
                  against: { name: 'A', description: 'B', content: 'C' },
                  order_within_rank: 'pages.updated_at DESC'

  pg_search_scope :search_tags,
                  associated_against: {
                    tags: :value
                  },
                  order_within_rank: 'pages.updated_at DESC'

  scope :for_site, ->(site_id) { where(site_id: site_id)}
  scope :enabled, -> { where(enabled: true) }

  belongs_to :site
  has_many :routes, through: :site
  has_one :site_template, through: :site
  has_many :users, through: :site
  has_one :dataset_setting, dependent: :destroy,
          inverse_of: :site_page, autosave: true
  has_one :dashboard_setting,foreign_key: 'page_id', dependent: :destroy,
          inverse_of: :site_page, autosave: true
  has_many :tags, foreign_key: :page_id
  has_many :content_images, dependent: :destroy

  before_create :set_defaults
  before_save :construct_url, if: 'content_type.eql? ContentType::LINK'

  validates :url, uniqueness: {scope: :site}, unless: 'content_type.eql?(nil) || content_type.eql?(ContentType::LINK)'
  validates :uri, uniqueness: {scope: :site}, unless: 'content_type.eql?(nil) || content_type.eql?(ContentType::LINK)'
  validates_presence_of :site_id
  before_create :cheat_with_position_on_create
  before_update :cheat_with_position_on_update
  after_create :update_routes
  after_update :update_routes, unless: 'content_type.eql?(nil) || content_type.eql?(ContentType::HOMEPAGE)'
  after_save :update_temporary_content_images

  validate :step_validation

  accepts_nested_attributes_for :tags, allow_destroy: true

  attr_accessor :form_step
  attr_accessor :thumbnail_url

  MAX_RELATED_PAGES_SIZE = 3

  def form_steps
    steps = {pages: %w[position title type],
             names: %w[Position Title Type]}

    case self.content_type
    when ContentType::OPEN_CONTENT
      steps = { pages: %w[position title type open_content open_content_preview],
                names: %w[Position Details Type Content Preview] }
    when ContentType::OPEN_CONTENT_V2
      steps = { pages: %w[position title type open_content_v2 open_content_v2_preview],
                names: %w[Position Details Type Content Preview] }
    when ContentType::ANALYSIS_DASHBOARD
      steps = { pages: %w[position title type dataset filters columns preview_analytics_dashboard],
                names: %w[Position Title Type Dataset Filters Columns Preview] }
    when ContentType::DASHBOARD_V2
      steps = { pages: %w[position title type dashboard_dataset dashboard_widget preview],
                names: %w[Position Details Type Dataset Widget Preview] }
    when ContentType::LINK
      steps = { pages: %w[position title type link],
                names: %w[Position Details Type Link] }
    when ContentType::STATIC_CONTENT
      steps = { pages: %w[title type open_content open_content_preview],
                names: %w[Details Type Content Preview] }
    when ContentType::MAP
      steps = { pages: %w[position title type map],
                names: %w[Position Details Type Map] }
    when ContentType::HOMEPAGE
      steps = { pages: %w[title open_content open_content_preview],
                names: ['Title', 'Open Content', 'Open Content Preview'] }
    when ContentType::TAG_SEARCHING
      steps = { pages: %w[position title type tag_searching],
                names: ['Position', 'Details', 'Type', 'Tag Searching'] }
    end
    steps
  end

  def uri=(value)
    if value
      value.gsub!(/[^a-zA-Z0-9\-?=&]/, '')
      write_attribute(:uri, value)
      regenerate_url
    end
  end

  def update_routes
    return if self.content_type.eql? ContentType::LINK
    DynamicRouter.update_routes_for_site_page self
  end

  # Content type cannot be changed
  def content_type=(value)
    if self.content_type && self.content_type != value
      self.errors[:content_type] << 'Type of the page is immutable'
    else
      write_attribute(:content_type, value) if value
    end
  end

  # Returns an object with the settings, ignoring the way it was saved
  def settings_structure
    return OpenStruct.new if content.nil?
    if content['settings'].is_a? Hash
      OpenStruct.new(content['settings'])
    else
      OpenStruct.new(JSON.parse(content['settings']))
    end
  end

  def related_pages
    SitePage.search_tags(self.tags.pluck(:value).join(', ')).limit(MAX_RELATED_PAGES_SIZE)
  end

  def attributes
    attrs = super
    attrs[:thumbnail_url] = thumbnail_url
    attrs[:tags] = tags
    attrs
  end

  private
  def construct_url
    if self.content['url']
      old_content = self.content
      unless old_content['url'].starts_with? 'http://', 'https://', '/', '?'
        old_content['url'] = 'http://' + old_content['url']
        self.content = old_content
      end
    end
  end

  def set_defaults
    self.enabled = false unless self.enabled
  end

  def step_validation
    steps_list = form_steps
    # Add the 3 first steps for when they don't exist
    steps_list[:pages].unshift(%w[position title type]).flatten! unless steps_list[:pages].include?('position')

    step_index = steps_list[:pages].index(form_step)

    # TODO: Change this. Toggle shouldn't check the validations
    return unless step_index # For operations where there are no steps, like toggle_enable

    # Validate Position & Parent Id
    if steps_list[:pages].index('position') <= step_index
      self.errors['position'] << 'You must select a position for the page' unless self.position
      self.errors['parent_id'] << 'You must select a parent for the current page' \
        unless (self.parent || self.content_type == ContentType::HOMEPAGE)
    end

    # Validate Name & Description & URI
    if steps_list[:pages].index('title') <= step_index
      self.errors['name'] << 'You must type a valid title for the page' if self.name.blank? || self.name.strip.blank?
      self.errors['description'] << 'You must type a valid description for the page' if self.description.blank? || self.description.strip.blank?
      self.errors['uri'] << 'You must type a valid uri for the page' \
        if self.content_type != ContentType::HOMEPAGE && (self.uri.blank? || self.uri.gsub(/[^a-zA-Z0-9\-]/, '').blank?)
      self.errors['uri'] << 'There\'s already a page with this name' if SitePage.where(site_id: site_id, uri: uri).where.not(id: self.id).any?
    end

    # Validate type
    if steps_list[:pages].index('type') <= step_index
      self.errors['content_type'] << 'Please select a valid type' unless self.content_type > 0 && self.content_type <= ContentType.length
    end


    # TODO : This part
    # Validate steps for Analysis Dashboard
    if self.content_type == ContentType::ANALYSIS_DASHBOARD
      # Validate Dataset

      # Validate Filters

      # Validate Columns

      # Validate Preview
    end


    # Validate steps for Open Content
    if self.content_type == ContentType::OPEN_CONTENT

    end


    # Validate steps for Link
    if self.content_type == ContentType::LINK

    end


    # Validate steps for Static Content
    if self.content_type == ContentType::STATIC_CONTENT

    end

    # Validate steps for Map
    if self.content_type == ContentType::MAP

    end

  end

  def cheat_with_position_on_create
    if self.position.present?
      siblings.where('position >= ?', self.position).update_all('position = position + 1')
    end
  end

  def cheat_with_position_on_update
    if self.position.present? && self.position_was.present? && self.position > self.position_was
      siblings.where('position <= ?', self.position).update_all('position = position - 1')
    else
      siblings.where('position >= ?', self.position).update_all('position = position + 1')
    end
  end

  def thumbnail_url
    self.thumbnail.url
  end

  def update_temporary_content_images
    return unless content
    new_content = content
    new_content.scan(/image":"([^"]*)"/).each do |tmp|
      tmp = tmp.first
      next unless tmp.include? '&temp_id='
      tmp_id = tmp.scan(/temp_id=([^"]*)/).first
      ci = ContentImage.new page_id: self.id, image: TemporaryContentImage.find(tmp_id.first).image
      ci.save
      new_content.gsub!(tmp, ci.image.url)

      # Remove old image
      TemporaryContentImage.find(tmp_id.first).destroy!
    end
    self.update_column :content, new_content
  end
end
