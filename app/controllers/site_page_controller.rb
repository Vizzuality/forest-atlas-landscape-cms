class SitePageController < ApplicationController
  before_action :load_site_page
  before_action :load_menu

  def load_site_page
    @site_page = SitePage.find(params[:id])

    redirect_to not_found_path unless @site_page
  end

  def load_menu
    @menu_root = @site_page.site.root
  end

  def homepage
  end

  def open_content
  end

  def map
  end

  def analysis_dashboard
  end

  def dynamic_indicator_dashboard
  end
end
