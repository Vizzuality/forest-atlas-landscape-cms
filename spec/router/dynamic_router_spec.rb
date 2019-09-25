require 'rails_helper'

RSpec.describe DynamicRouter do
  before(:each) do
    @router = DynamicRouter
    @route_cache = spy(TaggedCache)

    @router.instance_variable_set(:@route_cache, @route_cache)

    @sample_site_template = SiteTemplate.create!()

    @sample_site = Site.new(:name => 'Sample site', :site_template => @sample_site_template)
    save_without_route_update @sample_site

    @sample_route = Route.new(:host => 'localhost', :path => 'sample-path', :site => @sample_site)
    save_without_route_update @sample_route

    @sample_page = SitePage.new(:name => 'Sample page', :site_id => @sample_site.id, :uri => 'sample-page')
    save_without_route_update @sample_page
  end

  it 'Creating a site updates routes' do
    @site = Site.new(:name => 'Demo site', :routes => [@sample_route], :site_pages => [@sample_page], :site_template => @sample_site_template)
    save_without_route_update @site

    tags = ['r:'+@sample_route.id.to_s, 's:'+@site.id.to_s, 'p:'+@sample_page.id.to_s]
    expected_route = DynamicRouter::RouteDefinition.new('/sample-path/sample-page', 'site_page#open_content_v2', {:id => @sample_page.id}, {:host => 'localhost'}, tags)

    @router.update_routes_for_site(@site)
    expect(@route_cache).to have_received(:write).at_least(1).with(expected_route, tags)
  end

  it 'Creating a route updates routes' do
    @route = Route.new(:host => 'localhost', :path => 'the-path', :site => @sample_site)
    save_without_route_update @route

    tags = ['r:'+@sample_route.id.to_s, 's:'+@sample_site.id.to_s, 'p:'+@sample_page.id.to_s]
    expected_route = DynamicRouter::RouteDefinition.new('/sample-path/sample-page', 'site_page#open_content_v2', {:id => @sample_page.id}, {:host => 'localhost'}, tags)

    @router.update_routes_for_route(@route)
    expect(@route_cache).to have_received(:write).at_least(1).with(expected_route, tags)
  end

  it 'Creating a page updates routes' do
    @page = SitePage.new(:name => 'Demo page', :site_id => @sample_site.id, :uri => 'demo-page')
    save_without_route_update @page

    tags = ['r:'+@sample_route.id.to_s, 's:'+@sample_site.id.to_s, 'p:'+@page.id.to_s]
    expected_route = DynamicRouter::RouteDefinition.new('/sample-path/demo-page', 'site_page#open_content_v2', {:id => @page.id}, {:host => 'localhost'}, tags)

    @router.update_routes_for_site_page(@page)
    expect(@route_cache).to have_received(:write).at_least(1).with(expected_route, tags)
  end

  private

  def save_without_route_update(obj)
    obj.class.skip_callback :save, :after, :update_routes, raise: false
    obj.class.skip_callback :create, :after, :update_routes, raise: false
    obj.save!(validate: false)
    obj.class.set_callback :save, :after, :update_routes, raise: false
    obj.class.set_callback :create, :after, :update_routes, raise: false
  end

end
