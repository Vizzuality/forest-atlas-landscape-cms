class UpdateTermsPageTemplate < ActiveRecord::Migration[5.0]
  def up
    page_template = PageTemplate.where(uri: PageTemplate::TERMS_OF_SERVICE_SLUG).first
    return unless page_template.present?
    page_template.content = nil
    page_template.name = 'Terms of Service'
    page_template.save!
    Site.all.each do |site|
      unless site.site_settings.exists?(name: 'hosting_organization')
        site.site_settings.create!(name: 'hosting_organization', value: nil, position: 14)
      end
      site.update_terms_of_service_page(page_template)
    end
  end

  def down
    # noop
  end
end
