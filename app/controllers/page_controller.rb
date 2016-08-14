class PageController < ApplicationController
  def show
    @page = Page.find(params[:id])

    puts @page.path

    redirect_to not_found_path unless @page
  end

  def homepage
    @page = Page.find(params[:id])

    puts @page.path

    redirect_to not_found_path unless @page
  end
end
