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

class Page < ApplicationRecord
  extend EnumerateIt

  has_and_belongs_to_many :site_templates
  has_one :dataset_setting

  has_closure_tree order: 'position', dependent: :destroy
  has_enumeration_for :content_type, with: ContentType, skip_validation: true
  before_validation :regenerate_url, :unless => Proc.new { |page| page.content_type.eql? ContentType::LINK }


  def url=(value)
  end

  def uri=(value)
    if value
      value = value.gsub(/^[\/]+|[\/]+$/, '')
      write_attribute(:uri, value)
      regenerate_url
    end
  end

  def links(port=80)
    self.routes.map {|route| route.link(port) + self.url }
  end

  def disableable?
    [ContentType::LINK, ContentType::OPEN_CONTENT, ContentType::ANALYSIS_DASHBOARD, ContentType::DYNAMIC_INDICATOR_DASHBOARD].include? self.content_type
  end

  def visible?
    return false if !enabled
    return enabled if parent_id == nil
    Page.find(parent_id).visible?
  end

  private

  def regenerate_url
    uri = self.uri || ''
    current_url = '/' + uri
    parent_url = (parent.nil? || parent.url.eql?('/')) ? '' : parent.url
    current_url = parent_url + current_url
    write_attribute(:url, current_url)
  end

end
