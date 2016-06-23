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
  belongs_to :site
  after_save :update_routes

  def update_routes
    DynamicRouter.build_routes_for_route self
  end
end
