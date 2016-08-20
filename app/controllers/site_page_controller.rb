class SitePageController < ApplicationController

  def homepage
    @site_page = SitePage.find(params[:id])

    puts @site_page.path

    redirect_to not_found_path unless @site_page
  end

  def open_content
    @site_page = SitePage.find(params[:id])

    puts @site_page.path

    redirect_to not_found_path unless @site_page
  end

  def map
    @site_page = SitePage.find(params[:id])

    puts @site_page.path

    redirect_to not_found_path unless @site_page
  end

  def analysis_dashboard
    @site_page = SitePage.find(params[:id])

    puts @site_page.path

    redirect_to not_found_path unless @site_page
  end

  def dynamic_indicator_dashboard
    @site_page = SitePage.find(params[:id])

    puts @site_page.path

    redirect_to not_found_path unless @site_page
  end
end
