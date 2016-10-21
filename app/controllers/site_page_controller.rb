class SitePageController < ApplicationController
  before_action :load_site_page
  before_action :load_menu
  before_action :load_breadcrumbs
  protect_from_forgery except: :map_resources

  def load_site_page
    @site_page = SitePage.find(params[:id])

    redirect_to not_found_path unless @site_page
  end

  def load_menu
    @menu_root = @site_page.site.root
  end

  def load_breadcrumbs
    @breadcrumbs = []
    page = @site_page

   begin
      @breadcrumbs << page
      page = page.parent
    end while !page.nil?

    @breadcrumbs = @breadcrumbs.reverse
  end

  def homepage
  end

  def open_content
  end

  def static_content
  end

  def map_resources
  end

  def analysis_dashboard
  end

  def dynamic_indicator_dashboard
  end
end
