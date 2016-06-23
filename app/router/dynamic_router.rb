class DynamicRouter

  @route_cache = RouteMapper.new
  RouteDefinition = Struct.new(:path, :to, :defaults, :constraints, :tags)

  def self.load
    return unless ActiveRecord::Base.connection.table_exists? 'pages'
    Page.includes(:site, :routes).all.each do |page|
      self.build_routes_for_page(page)
    end
  end

  def self.build_routes_for_page(page)
    @route_cache.remove('p:'+page.id.to_s)
    page.routes.each do |route|
      constraints = {}
      constraints.store(:host, route.host) unless route.blank?

      path = '/' + (route.path.blank? ? '' : route.path) + page.url

      ancestor_tags = page.ancestors.map { |page| 'p:'+page.id.to_s }
      tags = ['r:'+route.id.to_s, 's:'+page.site.id.to_s, 'p:'+page.id.to_s] + ancestor_tags

      route = RouteDefinition.new(path, "page#show", {id: page.id}, constraints, tags)
      declare_route(route)
    end
  end

  def self.build_routes_for_site(site)
    @route_cache.remove('s:'+site.id.to_s)

    site.page.each do |page|
      build_routes_for_page(page)
    end
  end

  def self.build_routes_for_route(route)
    @route_cache.remove('r:'+route.id.to_s)

    route.site.page.each do |page|
      build_routes_for_page(page)
    end
  end

  def self.declare_route(route)
    @route_cache.write(route, route.tags)
    Rails.application.routes.draw do
      get route.path, :to => route.to, defaults: route.defaults, constraints: route.constraints
    end
  end

  def self.reload
    Rails.application.routes_reloader.reload!
  end

  def self.dump_routes
    @route_cache.dump_routes
  end

  def self.dump_tags
    @route_cache.dump_tags
  end

end
