xml.instruct!
xml.urlset xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" do
  @menu_root.site.pages_for_sitemap.each do |page|
    xml.url do
      xml.loc page.url
      xml.lastmod page.updated_at.strftime('%Y-%m-%d')
      xml.changefreq 'daily'
      xml.priority '0.5'
    end
  end
end
