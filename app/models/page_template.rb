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

class PageTemplate < Page
  has_many :page_site_templates, foreign_key: 'page_id',  dependent: :destroy
  TERMS_OF_SERVICE_SLUG = 'terms-and-privacy'

  def render_terms_of_service_template(site)
    template = File.read('lib/assets/terms_template.json.erb')
    hosting_organization = SiteSetting.hosting_organization(site.id).value ||
      '[HOSTING ORGANIZATION]'
    result = TemplateRenderer.render(
      template,
      {hosting_organization: hosting_organization}
    )
    {json: result}
  end

  private

  def self.terms_of_service_template
    template = File.read('lib/assets/terms_template.json.erb')
  end
end
