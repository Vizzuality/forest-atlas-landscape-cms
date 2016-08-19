class DynamicRouter

  RouteDefinition = Struct.new(:path, :to, :defaults, :constraints, :tags)

  @route_cache ||= TaggedCache.new(
    Proc.new { |route| 'route/'+ route.constraints[:host] + route.path }
  )

  def self.reload
    Rails.application.routes_reloader.reload!
  end

  def self.load
    if @route_cache.empty?
      return unless ActiveRecord::Base.connection.schema_cache.data_source_exists? 'pages'

      Page.includes(:site, :routes).all.each do |page|
        page.routes.each do |route|
          _build_routes_for_page_and_route(page, route)
        end
      end
    end

    _load_routes_from_cache
  end

  def self.update_routes_for_page(page)
    return if page.id.nil?

    @route_cache.remove('p:'+page.id.to_s)

    page.routes.each do |route|
      _build_routes_for_page_and_route(page, route)
    end

    self.reload
  end

  def self.update_routes_for_site(site)
    return if site.id.nil?

    @route_cache.remove('s:'+site.id.to_s)

    site.pages.each do |page|
      page.routes.each do |route|
        _build_routes_for_page_and_route(page, route)
      end
    end

    self.reload
  end

  def self.update_routes_for_route(route)
    return if route.id.nil?

    @route_cache.remove('r:'+route.id.to_s)

    route.pages.each do |page|
      _build_routes_for_page_and_route(page, route)
    end

    self.reload
  end

  def self._build_routes_for_page_and_route(page, route)
    return unless ActiveRecord::Base.connection.schema_cache.data_source_exists? 'pages'

    constraints = {}
    constraints.store(:host, route.host) unless route.blank?

    path = '/' + (route.path.blank? ? '' : route.path) + page.url

    ancestor_tags = page.ancestors.map { |page| 'p:'+page.id.to_s }
    tags = ['r:'+route.id.to_s, 's:'+page.site.id.to_s, 'p:'+page.id.to_s] + ancestor_tags

    case page.content_type
      when ContentType::HOMEPAGE
        target = 'page#homepage'
      when ContentType::OPEN_CONTENT
        target = 'page#open_content'
      when ContentType::MAP
        target = 'page#map'
      when ContentType::ANALYSIS_DASHBOARD
        target = 'page#analysis_dashboard'
      when ContentType::DYNAMIC_INDICATOR_DASHBOARD
        target = 'page#dynamic_indicator_dashboard'
      else
        target = 'page#open_content'
    end

    route = RouteDefinition.new(path, target, {id: page.id}, constraints, tags)
    @route_cache.write(route, route.tags) unless route.nil?
  end

  def self._declare_route(route)
    Rails.application.routes.draw do
      get route.path, :to => route.to, defaults: route.defaults, constraints: route.constraints
    end
  end

  def self._load_routes_from_cache
    @route_cache.all.each do |route|
      _declare_route(route)
    end
  end

  def self.dump_tags
    @route_cache.dump_tags
  end

end
