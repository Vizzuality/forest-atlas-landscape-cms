module ApplicationHelper
  def current_class(*controller)
    controller.include?(params[:controller]) ? 'active ' : ''
  end

  def page_link(page)
    "<a href=\"#{ page.content_type.equal?(ContentType::LINK) ? page.content['url'] : page.url  }\">#{ page.name }</a>".html_safe
  end
end
