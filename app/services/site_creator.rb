class SiteCreator
  def self.create_site_content(site)
    return nil if site.site_template.nil? or site.site_template.empty?

    pages = site.site_template.pages
    @new_page_tree = {}

    pages.each do |page|
      newPage = Page.create!(
        {
          name: page.name,
          description: page.description,
          uri: page.url,
          site: site,
          content_type: page.content_type,
          parent: get_parent_content(page)
        }
      )
      @new_page_tree[page.id] = newPage
    end
  end

  def self.get_parent_content(page)
    return nil if (page.parent_id.nil?) || @new_page_tree.key?(page.parent_id)

    @new_page_tree[page.parent_id]
  end
end
