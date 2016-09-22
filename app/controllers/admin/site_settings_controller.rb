class Admin::SiteSettingsController < ApplicationController

  before_action :set_site, only: [:show, :edit, :update, :destroy]

  def index
    @properties = SiteSetting.find_by(params[:site_id])
  end

  private
  def set_site
    @site = Site.find(params[:site_id])
  end
end
