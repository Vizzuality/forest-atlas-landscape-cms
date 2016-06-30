# == Schema Information
#
# Table name: pages
#
#  id          :integer          not null, primary key
#  site_id     :integer
#  name        :string
#  description :string
#  url         :string
#  ancestry    :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Page < ApplicationRecord
  belongs_to :site
  has_many :routes, through: :site
  validates :url, uniqueness: {scope: :site}

  has_ancestry

  before_validation :regenerate_url

  def url=(value)
    raise 'Cannot manually set the URL for a page, please set uri instead'
  end

  def uri=(value)
    value = value.gsub(/^[\/]+|[\/]+$/, '')
    write_attribute(:uri, value)
  end

  private

  def regenerate_url
    current_url = '/' + uri
    parent_url = (parent.nil? || parent.url.eql?('/')) ? '' : parent.url
    current_url = parent_url + current_url
    write_attribute(:url, current_url)
  end
end
