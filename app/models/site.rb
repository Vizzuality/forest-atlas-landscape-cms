# == Schema Information
#
# Table name: sites
#
#  id          :integer          not null, primary key
#  site_template_id :integer
#  name        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Site < ApplicationRecord
  belongs_to :site_template
  has_many :routes
  has_many :pages

  after_save :update_routes

  def update_routes
    DynamicRouter.update_routes_for_site self
  end
end
