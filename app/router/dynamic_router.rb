class DynamicRouter
  def self.load
    return unless ActiveRecord::Base.connection.table_exists? 'pages'

    Page.includes(:site, :routes).all.each do |page|
      self.build_route(page)
    end
  end

  def self.build_route(page)
    page.routes.each do |route|
      constraints = {}
      constraints.store(:host, route.host) unless route.blank?

      path = '/' + (route.path.blank? ? '' : route.path + '/') + page.url

      Rails.application.routes.draw do
        get path, :to => "page#show", defaults: {id: page.id}, constraints: constraints
      end
    end
  end

  def self.reload
    Rails.application.routes_reloader.reload!
  end

end
