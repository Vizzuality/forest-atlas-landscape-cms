# == Schema Information
#
# Table name: sites
#
#  id               :integer          not null, primary key
#  site_template_id :integer
#  name             :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class Site < ApplicationRecord
  belongs_to :site_template
  has_many :routes
  has_many :pages
  has_many :user_site_associations
  has_many :users, through: :user_site_associations


  after_save :update_routes
  after_create :create_template_content

  def update_routes
    DynamicRouter.update_routes_for_site self
  end

  def create_template_content
    SiteCreator.create_site_content self
  end
end
