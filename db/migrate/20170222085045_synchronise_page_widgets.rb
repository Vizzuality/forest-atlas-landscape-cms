class SynchronisePageWidgets < ActiveRecord::Migration[5.0]
  def change
    # For evety existing page, store its links to widgets
    # by parsing the content
    pages_with_widgets = Page.
      where(content_type: ContentType::OPEN_CONTENT).
      where('content IS NOT NULL')
    pages_with_widgets.each do |page|
      next if page.content.nil?
      content = JSON.parse(page.content['json'])
      page.synchronise_page_widgets(content)
    end
  end
end
