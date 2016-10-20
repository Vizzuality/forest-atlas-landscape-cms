# == Schema Information
#
# Table name: routes
#
#  id         :integer          not null, primary key
#  site_id    :integer
#  host       :string
#  path       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Route < ApplicationRecord
  belongs_to :site, optional: true
  has_many :site_pages, through: :site

  after_save :update_routes

  def link(port=80)
    protocol = (port == 443 ? 'https://' : 'http://')
    port = ([443, 80].include?(port) ? '' : ':' + port.to_s)
    protocol + host + port + (path.blank? ? '' : ('/' + path))
  end

  def update_routes
    DynamicRouter.update_routes_for_route self
  end
end
