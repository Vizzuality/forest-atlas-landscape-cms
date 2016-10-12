class SiteCreator
  def self.create_site_content(site)
    return nil if site.site_template_id.nil?

    page_root = PageTemplate
                  .joins(:site_templates)
                  .where(:parent_id => nil, "site_templates.id" => site.site_template_id)
                  .take
    return if page_root.nil?

    pages = page_root.self_and_descendants

    @new_page_tree = {}

    pages.each do |page|
      newPage = SitePage.create!(
        {
          name: page.name,
          description: page.description,
          uri: page.uri,
          site: site,
          content_type: page.content_type,
          parent: get_parent_content(page)
        }
      )
      @new_page_tree[page.id] = newPage
    end
  end

  def self.get_parent_content(page)
    return nil if (page.parent_id.nil?) || !@new_page_tree.key?(page.parent_id)

    @new_page_tree[page.parent_id]
  end
end
