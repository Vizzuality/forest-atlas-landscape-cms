class Admin::SiteSettingsController < AdminController

  before_action :set_site, only: [:show, :edit, :update, :destroy]
  before_action :set_settings, only: [:show, :edit, :update, :destroy]

  COLOR_CONTROLLER_ID = 'site_site_settings_attributes_4_value'.freeze
  COLOR_CONTROLLER_NAME = 'site[site_settings_attributes][4][value]'.freeze

  def index
  end

  def new
  end

  def edit
  end

  def create
    if @site.save
      redirect_to admin_site_user_path
      render :new
    end
  end

  def update
  end

  def show
    gon.colorControllerId = COLOR_CONTROLLER_ID
    gon.colorControllerName = COLOR_CONTROLLER_NAME
    gon.colorArray = @settings.where(name: 'flag').first[:value].split(' ').map{ |x| {color: x }}

    # TODO: Verify if we should have a mandatory background and logo
    # ... if so, we should set these two fields as dirty whenever the image is empty
  end


  private
  def set_site
    @site = Site.find(params[:id])
  end

  def set_settings
    @settings = @site.get_ordered_settings
  end
end
