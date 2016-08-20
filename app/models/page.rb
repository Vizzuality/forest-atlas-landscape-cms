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
#  ancestry     :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  content      :text
#  content_type :integer
#  type         :text
#

class Page < ApplicationRecord
  extend EnumerateIt

  belongs_to :site
  has_many :routes, through: :site
  has_and_belongs_to_many :site_templates
  validates :url, uniqueness: {scope: :site}

  has_ancestry

  before_validation :regenerate_url
  after_save :update_routes

  has_enumeration_for :content_type, with: ContentType, skip_validation: true

  def update_routes
    DynamicRouter.update_routes_for_site_page self
  end

  def url=(value)
    raise 'Cannot manually set the URL for a page, please set uri instead'
  end

  def uri=(value)
    value = value.gsub(/^[\/]+|[\/]+$/, '')
    write_attribute(:uri, value)
    regenerate_url
  end

  def links(port=80)
    self.routes.map {|route| route.link(port) + self.url }
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
