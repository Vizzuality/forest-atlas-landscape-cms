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

  before_save :construct_url, if: 'content_type.eql? ContentType::LINK'
  validates :url, uniqueness: {scope: :site}, unless: 'content_type.eql? ContentType::LINK'
  after_save :update_routes

  cattr_accessor :form_steps do
    %w[dataset filters columns customization preview]
  end
  attr_accessor :form_step

  def update_routes
    return if self.content_type.eql? ContentType::LINK
    DynamicRouter.update_routes_for_site_page self
  end

  private
  def construct_url
    if self.content['url']
      old_content = self.content
      unless old_content['url'].starts_with? 'http://', 'https://'
        old_content['url'] = 'http://' + old_content['url']
        self.content = old_content
      end
    end
  end
end
