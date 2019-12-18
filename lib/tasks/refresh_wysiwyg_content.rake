namespace :pages do
  desc 'Refresh TOS and privacy pages'
  task refresh_tos_and_privacy_pages: :environment do
    # Empty content of all the homepages with page_version set to 1
    Page.where(
      content_type: ContentType::HOMEPAGE,
      page_version: 1
    ).each do |page|
      page.update_attributes(content: '')
    end

    # Change URL and name of the TOS pages
    Page.where(uri: 'terms-and-privacy').each do |page|
      page.update_attributes(
        name: 'Terms of service',
        url: '/terms-of-service',
        uri: 'terms-of-service'
      )
    end

    # Reset all the privacy and TOS pages to their default content
    Page.where(uri: 'terms-of-service').where.not(site_id: nil).each do |page|
      site = page.site
      site_template = site.site_template
      page_template = PageTemplate.
        joins(:site_templates).
        find_by('site_templates.id' => site_template.id, uri: page.uri)

      page.update(
        content: page_template.render_terms_of_service_template(site)
      )
    end

    Page.where(uri: 'privacy-policy').where.not(site_id: nil).each do |page|
      template = File.read('lib/assets/privacy_policy_page.json')
      page.update(content: template)
    end
  end
end
