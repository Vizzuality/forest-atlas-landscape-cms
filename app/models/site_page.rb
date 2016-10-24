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

class SitePage < Page
  belongs_to :site
  has_many :routes, through: :site
  has_one :site_template, through: :site
  has_many :users, through: :site

  validates :url, uniqueness: {scope: :site}, unless: 'content_type.eql? ContentType::LINK'
  after_save :update_routes

  def update_routes
    return if self.content_type.eql? ContentType::LINK
    DynamicRouter.update_routes_for_site_page self
  end
end
