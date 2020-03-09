module SitePagesHelper
  def nested_page_links(parent)
    content_tag(:ul, class: (parent.parent.nil? ? 'sitemap' : '')) do
      if parent.parent.nil? # add homepage
        concat content_tag(:li, link_to(parent.name, parent.url))
      end
      parent.children.where('content_type <> ?', ContentType::LINK).select{ |p| p.visible? }.map do |page|
        concat (content_tag(:li) do
          if page.children.size > 0
            link_to(page.name, page.url) +
            nested_page_links(page)
          else
            link_to(page.name, page.url)
          end
        end)
      end
    end
  end

  def parse_map_field(field)
    field = field.is_a?(Hash) ? field.to_json : JSON.parse(field).to_json
    field = field.blank? ? '{}' : field
    field.squish.gsub("'", "\\\\'").html_safe
  rescue
    '{}'
  end
end
