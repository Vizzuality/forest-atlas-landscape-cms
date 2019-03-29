# == Schema Information
#
# Table name: pages
#
#  id                       :integer          not null, primary key
#  site_id                  :integer
#  name                     :string
#  description              :string
#  uri                      :string
#  url                      :string
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  content_type             :integer
#  type                     :text
#  enabled                  :boolean          default(FALSE)
#  parent_id                :integer
#  position                 :integer
#  content                  :json
#  show_on_menu             :boolean          default(TRUE)
#  page_version             :integer          default(1)
#  thumbnail_file_name      :string
#  thumbnail_content_type   :string
#  thumbnail_file_size      :integer
#  thumbnail_updated_at     :datetime
#  cover_image_file_name    :string
#  cover_image_content_type :string
#  cover_image_file_size    :integer
#  cover_image_updated_at   :datetime
#

class PageTemplate < Page
  has_many :page_site_templates, foreign_key: 'page_id',  dependent: :destroy
  TERMS_OF_SERVICE_SLUG = 'terms-and-privacy'
  PRIVACY_POLICY_SLUG = 'privacy-policy'.freeze

  def render_terms_of_service_template(site)
    template = File.read('lib/assets/terms_template.json.erb')
    hosting_organization = SiteSetting.hosting_organization(site.id).try(:value) ||
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
