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

class Page < ApplicationRecord
  extend EnumerateIt

  belongs_to :site, optional: true
  has_and_belongs_to_many :site_templates
  has_many :page_widgets, dependent: :destroy
  has_many :widgets, through: :page_widgets, validate: false
  has_attached_file :thumbnail, styles: {original: '200x200#'}
  validates_attachment :thumbnail,
                       content_type: {content_type: %w[image/jpg image/jpeg image/png]}
  has_attached_file :cover_image, styles: {original: '2000x1000#'}
  validates_attachment :cover_image,
                       content_type: {content_type: %w[image/jpg image/jpeg image/png]}

  has_closure_tree order: 'position', dependent: :destroy
  has_enumeration_for :content_type, with: ContentType, skip_validation: true
  before_validation :regenerate_url

  def url=(value); end

  def uri=(value)
    return unless value

    value = value.gsub(/^[\/]+|[\/]+$/, '')
    write_attribute(:uri, value)
    regenerate_url
  end

  # TODO potentially obsolete
  def links(port = 80)
    routes.map { |route| route.link(port) + url }
  end

  def deletable?
    [ContentType::LINK,
     ContentType::OPEN_CONTENT_V2,
     ContentType::DASHBOARD_V2,
     ContentType::TAG_SEARCHING,
     ContentType::MAP].include? content_type
  end

  def disableable?
    content_type != ContentType::HOMEPAGE &&
      content_type != ContentType::STATIC_CONTENT
  end

  def visible?
    return false unless enabled
    return enabled if parent_id.nil?
    Page.find(parent_id).visible?
  end

  def visible_children?
    children.each do |child|
      return true if child.visible? && child.show_on_menu
    end
    false
  end

  def synchronise_page_widgets(page_params_hash)
    content = page_params_hash['content']
    return unless content.is_a?(Hash) && content['json'].present?
    content_after = JSON.parse(content['json'])
    widget_ids_after = get_widget_ids_from_object(content_after).flatten.compact
    current_widget_ids = page_widgets.pluck(:widget_id)
    removed_widget_ids = current_widget_ids.reject { |id| widget_ids_after.include?(id) }
    PageWidget.delete(removed_widget_ids) unless removed_widget_ids.empty?
    added_widget_ids = widget_ids_after.reject { |id| current_widget_ids.include?(id) }
    added_widget_ids.each { |id| PageWidget.create(page_id: self.id, widget_id: id) }
  end

  private

  def get_widget_ids_from_object(object)
    if object.respond_to?(:key?) && object.key?('widget')
      object['widget']['id']
    elsif object.respond_to?(:each)
      object.map { |o| get_widget_ids_from_object(o) }
    end
  end

  def regenerate_url
    uri = self.uri || ''
    current_url = '/' + uri
    parent_url = (parent.nil? || parent.url.eql?('/')) ? '' : parent.url
    current_url = parent_url + current_url
    write_attribute(:url, current_url)
  end
end
