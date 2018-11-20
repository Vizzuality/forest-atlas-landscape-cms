# TODO: Remove
class Admin::SiteUsersController < AdminController

  before_action :set_site, only: [:show, :edit, :update, :destroy]

  def index

  end

  def new

  end

  def update

  end

  def create

  end

  def upgrade

  end

  private
  def set_site
    @site = Site.find(params[:id])
  end
end
