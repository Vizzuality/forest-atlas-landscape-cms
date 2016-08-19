class PageController < ApplicationController

  def homepage
    @page = Page.find(params[:id])

    puts @page.path

    redirect_to not_found_path unless @page
  end

  def open_content
    @page = Page.find(params[:id])

    puts @page.path

    redirect_to not_found_path unless @page
  end

  def map
    @page = Page.find(params[:id])

    puts @page.path

    redirect_to not_found_path unless @page
  end

  def analysis_dashboard
    @page = Page.find(params[:id])

    puts @page.path

    redirect_to not_found_path unless @page
  end

  def dynamic_indicator_dashboard
    @page = Page.find(params[:id])

    puts @page.path

    redirect_to not_found_path unless @page
  end
end
