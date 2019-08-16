# == Schema Information
#
# Table name: pages
#
#  id                       :integer          not null, primary key
#  site_id                  :integer
#  name                     :string
#  description              :string
#  uri                      :string
#  url                      :string
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  content_type             :integer
#  type                     :text
#  enabled                  :boolean          default(FALSE)
#  parent_id                :integer
#  position                 :integer
#  content                  :json
#  show_on_menu             :boolean          default(TRUE)
#  page_version             :integer          default(1)
#  thumbnail_file_name      :string
#  thumbnail_content_type   :string
#  thumbnail_file_size      :integer
#  thumbnail_updated_at     :datetime
#  cover_image_file_name    :string
#  cover_image_content_type :string
#  cover_image_file_size    :integer
#  cover_image_updated_at   :datetime
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
                  using: {
                    tsearch: { any_word: true }
                  },
                  order_within_rank: 'pages.updated_at DESC'

  scope :for_site, ->(site_id) { where(site_id: site_id)}
  scope :enabled, -> { where(enabled: true) }
  scope :not_tag_page, -> { where.not(content_type: ContentType::TAG_SEARCHING)}
  scope :not_link_page, -> { where.not(content_type: ContentType::LINK)}
  scope :not_group_page, -> { where.not(content_type: ContentType::GROUP)}

  belongs_to :site
  has_many :routes, through: :site
  has_one :site_template, through: :site
  has_many :users, through: :site
  has_one :dataset_setting, dependent: :destroy,
          inverse_of: :site_page, autosave: true
  has_one :dashboard_setting,foreign_key: 'page_id', dependent: :destroy,
          inverse_of: :site_page, autosave: true
  has_many :tags, foreign_key: :page_id, dependent: :destroy
  has_many :content_images, dependent: :destroy, foreign_key: :page_id

  before_create :set_defaults
  before_save :construct_url, if: 'content_type.eql? ContentType::LINK'
  before_save :update_temporary_cover_and_thumb
  before_save :convert_booleans_in_map_pages

  validates :url, uniqueness: {scope: :site}, unless: 'content_type.eql?(nil) || content_type.eql?(ContentType::LINK)'
  validates :uri, uniqueness: {scope: :site}, unless: 'content_type.eql?(nil) || content_type.eql?(ContentType::LINK)'
  validates_presence_of :site_id
  before_create :cheat_with_position_on_create
  before_update :cheat_with_position_on_update
  after_create :update_routes
  after_update :update_routes, unless: 'content_type.eql?(nil) || content_type.eql?(ContentType::HOMEPAGE)'
  after_save :update_temporary_content_images
  after_save :destroy_temporary_cover_and_thumb

  validate :step_validation

  accepts_nested_attributes_for :tags, allow_destroy: true

  has_attached_file :thumbnail, styles: { original: '800x>' }

  attr_accessor :form_step
  attr_accessor :thumbnail_url
  attr_accessor :temp_cover_image
  attr_accessor :temp_thumbnail
  attr_accessor :delete_thumbnail
  attr_accessor :delete_cover_image

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
    when ContentType::DASHBOARD_V2
      steps = { pages: %w[position title type dashboard_dataset dashboard_widget columns_selection preview],
                names: %w[Position Details Type Dataset Widget Columns Preview] }
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
    when ContentType::GROUP
      steps = { pages: %w[position title type confirmation],
                names: %w[Position Details Type Confirmation] }
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
    return OpenStruct.new if content.nil? || content['settings'].blank?
    if content['settings'].is_a? Hash
      OpenStruct.new(content['settings'])
    else
      OpenStruct.new(JSON.parse(content['settings'])) rescue OpenStruct.new
    end
  end

  def related_pages
    SitePage.for_site(site_id).not_tag_page
      .not_group_page.enabled
      .search_tags(self.tags.pluck(:value).join(', '))
      .where.not(id: id).limit(MAX_RELATED_PAGES_SIZE)
  end

  def attributes
    attrs = super
    attrs[:thumbnail_url] = thumbnail_url
    attrs[:tags] = tags
    attrs[:temp_cover_image] = temp_cover_image
    attrs[:temp_thumbnail] = temp_thumbnail
    attrs[:delete_cover_image] = delete_cover_image
    attrs[:delete_thumbnail] = delete_thumbnail
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

  def update_temporary_cover_and_thumb
    if delete_cover_image
      self.cover_image.clear
    elsif temp_cover_image.present?
      self.cover_image = TemporaryContentImage.find(temp_cover_image).image
    end
    if self.delete_thumbnail == '1'
      self.thumbnail.clear
    elsif temp_thumbnail.present?
      self.thumbnail = TemporaryContentImage.find(temp_thumbnail).image
    end
  end

  def destroy_temporary_cover_and_thumb
    if temp_cover_image.present?
      TemporaryContentImage.find(temp_cover_image).destroy rescue nil
    end
    if temp_thumbnail.present?
      TemporaryContentImage.find(temp_thumbnail).destroy rescue nil
    end
  end

  def update_temporary_content_images
    return if content_type.blank? || content.blank?
    return unless [ContentType::OPEN_CONTENT, ContentType::OPEN_CONTENT_V2].include?(content_type)
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

  def convert_booleans_in_map_pages
    return unless content_type == ContentType::MAP

    begin
      self.content['settings'].each do |entry|
        if entry.last == 'true'
          content['settings'][entry.first] = true
        elsif entry.last == 'false'
          content['settings'][entry.first] = false
        end
      end
    rescue Exception => e
      Rails.logger.error e.message
    end
  end
end
