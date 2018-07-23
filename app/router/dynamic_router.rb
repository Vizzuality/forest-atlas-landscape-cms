class DynamicRouter

  RouteDefinition = Struct.new(:path, :to, :defaults,
                               :constraints, :tags, :redirect_host)

  @route_cache ||= TaggedCache.new(
    Proc.new { |route| 'route/' + route.constraints[:host] + route.path }
  )

  def self.reload
    # Rails.logger.debug ">>> DynamicRouter.reload"
    Rails.application.routes_reloader.reload!
  end

  def self.load
    begin
      ActiveRecord::Migration.check_pending!
    rescue ActiveRecord::PendingMigrationError => e
      Rails.logger.error "Pending migrations - cannot load dynamic routes"
      return
    end
    # Rails.logger.debug ">>> DynamicRouter.load"
    if @route_cache.empty?
      SitePage.includes(:site, :routes).all.each do |site_page|
        site_page.routes.each do |route|
          _build_routes_for_page_and_route(site_page, route)
        end
      end
    end

    _load_routes_from_cache
  end

  def self.update_routes_for_site_page(site_page)
    # Rails.logger.debug ">>> DynamicRouter.update_routes_for_site_page #{site_page.try(:id) || 'NULL'}"
    return if site_page.id.nil?

    @route_cache.remove('p:' + site_page.id.to_s)

    site_page.routes.each do |route|
      _build_routes_for_page_and_route(site_page, route)
    end

    self.reload
  end

  def self.update_routes_for_site(site)
    # Rails.logger.debug ">>> DynamicRouter.update_routes_for_site #{site.try(:id) || 'NULL'}"
    return if site.id.nil?

    @route_cache.remove('s:' + site.id.to_s)

    site.site_pages.each do |site_page|
      site_page.routes.each do |route|
        _build_routes_for_page_and_route(site_page, route)
      end
    end

    self.reload
  end

  def self.update_routes_for_route(route)
    # Rails.logger.debug ">>> DynamicRouter.update_routes_for_route #{route.try(:id) || 'NULL'}"
    return if route.id.nil?

    @route_cache.remove('r:' + route.id.to_s)

    route.site_pages.each do |site_page|
      _build_routes_for_page_and_route(site_page, route)
    end

    self.reload
  end

  def self._build_routes_for_page_and_route(site_page, route)
    # Rails.logger.debug ">>> DynamicRouter._build_routes_for_page_and_route #{site_page.id}, #{route.id}"
    main_route_host = route.main ? nil : site_page.site.routes.where(main: true).first&.host

    constraints = {}
    constraints.store(:host, route.host.gsub(/https?:\/\//, '')) unless route.blank? || route.host.blank?

    path = '/' + (route.path.blank? ? '' : route.path.sub(/^\//, '')) + site_page.url.to_s

    ancestor_tags = site_page.ancestors.map { |site_page| 'p:' + site_page.id.to_s }
    tags = ['r:' + route.id.to_s, 's:' + site_page.site.id.to_s,
            'p:' + site_page.id.to_s] + ancestor_tags

    routes_to_write = []

    case site_page.content_type
      when ContentType::HOMEPAGE
        # Create error pages routes
        [
          {error: '/404', action: 'not_found'},
          {error: '/500', action: 'internal_server_error'},
          {error: '/422', action: 'unacceptable'}
        ].each do |error|
          routes_to_write << RouteDefinition.new(error[:error], 'site_page#' +
            error[:action], { id: site_page.id }, constraints, tags, main_route_host)
        end
        routes_to_write <<
          RouteDefinition.new('/sitemap', 'site_page#sitemap',
                              { id: site_page.id },
                              constraints, tags, main_route_host)
        routes_to_write <<
          RouteDefinition.new('/not_found', 'site_page#not_found',
                              { id: site_page.id },
                              constraints, tags, main_route_host)
        routes_to_write <<
          RouteDefinition.new('/login', 'site_page#login',
                              { id: site_page.id },
                              constraints, tags, main_route_host)
        routes_to_write <<
          RouteDefinition.new('/login_redirect', 'site_page#login_redirect',
                              { id: site_page.id },
                              constraints, tags, main_route_host)
        routes_to_write <<
          RouteDefinition.new('/logout', 'site_page#logout',
                              { id: site_page.id },
                              constraints, tags, main_route_host)

        target = 'site_page#homepage'
      when ContentType::HOMEPAGE_V2
        target = 'site_page#homepagev2'
      when ContentType::OPEN_CONTENT
        target = 'site_page#open_content'
      when ContentType::OPEN_CONTENT_V2
        target = 'site_page#open_content_v2'
      when ContentType::MAP
        target = 'site_page#map'
        # Create resources and report pages routes
        routes_to_write <<
          RouteDefinition.new('/resources.js', 'site_page#map_resources',
                              { id: site_page.id },
                              constraints, tags, main_route_host)
        routes_to_write <<
          RouteDefinition.new('/report.html', 'site_page#map_report',
                              { id: site_page.id },
                              constraints, tags, main_route_host)
      when ContentType::ANALYSIS_DASHBOARD
        target = 'site_page#analysis_dashboard'
      when ContentType::DASHBOARD_V2
        target = 'site_page#dashboard_v2'
      when ContentType::STATIC_CONTENT
        target = 'site_page#static_content'
      when ContentType::LINK
        return
      else
        target = 'site_page#open_content'
    end

    routes_to_write <<
      RouteDefinition.new(path, target, { id: site_page.id },
                          constraints, tags, main_route_host)
    routes_to_write.compact.each do |route|
      Rails.logger.debug '>>>>>> Writing to cache ' + route.inspect
      @route_cache.write(route, route.tags)
    end
  end

  def self._declare_route(route)
    # Rails.logger.debug ">>> DynamicRouter._declare_route " + route.inspect
    Rails.application.routes.draw do
      if route.redirect_host
        route.path = '/' if route.path == '//' # the homepage has two slashes
        get route.path,
            defaults: route.defaults,
            constraints: route.constraints,
            to: redirect(route.redirect_host + route.path)
      else
        get route.path,
            :to => route.to, defaults: route.defaults,
            constraints: route.constraints
      end
    end
  end

  def self._load_routes_from_cache
    # Rails.logger.debug ">>> DynamicRouter._load_routes_from_cache"
    @route_cache.all.each do |route|
      _declare_route(route)
    end
  end

  def self.dump_tags
    @route_cache.dump_tags
  end

end
