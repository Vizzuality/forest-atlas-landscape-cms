class Admin::SiteSettingsController < AdminController

  before_action :set_site, only: [:show, :edit, :update, :destroy]
  before_action :set_settings, only: [:show, :edit, :update, :destroy]

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


  private
  def set_site
    @site = Site.find(params[:id])
  end

  def set_settings
    @settings = @site.get_ordered_settings
  end
end
