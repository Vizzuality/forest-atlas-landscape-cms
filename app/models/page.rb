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
#  enabled      :boolean          default(FALSE)
#  parent_id    :integer
#  position     :integer
#  content      :json
#  show_on_menu :boolean          default(TRUE)
#  page_version :integer          default(1)
#

class Page < ApplicationRecord
  extend EnumerateIt

  belongs_to :site, optional: true
  has_and_belongs_to_many :site_templates
  has_many :page_widgets, dependent: :destroy
  has_many :widgets, through: :page_widgets, validate: false

  has_closure_tree order: 'position', dependent: :destroy
  has_enumeration_for :content_type, with: ContentType, skip_validation: true
  before_validation :regenerate_url

  def url=(value)
  end

  def uri=(value)
    if value
      value = value.gsub(/^[\/]+|[\/]+$/, '')
      write_attribute(:uri, value)
      regenerate_url
    end
  end

  # TODO potentially obsolete
  def links(port=80)
    self.routes.map { |route| route.link(port) + self.url }
  end

  def deletable?
    [ContentType::LINK, ContentType::OPEN_CONTENT, ContentType::OPEN_CONTENT_V2, ContentType::ANALYSIS_DASHBOARD, ContentType::DASHBOARD_V2].include? self.content_type
  end

  def disableable?
    self.content_type != ContentType::HOMEPAGE and self.content_type != ContentType::STATIC_CONTENT
  end

  def visible?
    return false if !enabled
    return enabled if parent_id == nil
    Page.find(parent_id).visible?
  end

  def has_visible_children?
    self.children.each do |child|
      return true if child.visible? && child.show_on_menu
    end
    return false
  end

  def synchronise_page_widgets(page_params_hash)
    content = page_params_hash['content']
    return unless content.is_a?(Hash) && content['json'].present?
    content_after = JSON.parse(content['json'])
    widget_ids_after = get_widget_ids_from_object(content_after).flatten.compact
    current_widget_ids = page_widgets.pluck(:widget_id)
    removed_widget_ids = current_widget_ids.select{ |id| !widget_ids_after.include?(id) }
    PageWidget.delete(removed_widget_ids) unless removed_widget_ids.empty?
    added_widget_ids = widget_ids_after.select{ |id| !current_widget_ids.include?(id) }
    added_widget_ids.each{ |id| PageWidget.create(page_id: self.id, widget_id: id)}
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
