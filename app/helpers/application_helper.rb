module ApplicationHelper
  def current_class(*controller)
    controller.include?(params[:controller]) ? 'active ' : ''
  end

  def page_link(page)
    href = page.content_type.equal?(ContentType::LINK) ? page.content['url'] : page.url
    target_blank = 'target="_blank"' if page.content_type.equal?(ContentType::LINK) and page.content['target_blank'].eql? '1'
    "<a href=\"#{ href }\" #{ target_blank }>#{ page.name }</a>".html_safe
  end
end
