module ApplicationHelper
  def current_class(*controller)
    controller.include?(params[:controller]) ? 'active ': ''
  end
end
