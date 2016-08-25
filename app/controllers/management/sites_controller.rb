class Management::SitesController < ManagementController
  before_action :set_site, only: [:structure]

  # GET /management/sites
  # GET /management/sites.json
  def index
    @sites = Site.joins(:users)
               .where(users: {id: current_user.id})
               .paginate(:page => params[:page], :per_page => params[:per_page])
               .order(params[:order] || 'created_at ASC')

    respond_to do |format|
      format.html { render :index }
      format.json { render json: @sites }
    end
  end

  # GET /management/:site_slug/structure
  # GET /management/:site_slug/structure.json
  def structure
    @pages = SitePage.joins(:users)
               .where(users: {id: current_user.id})
               .where(sites: {slug: params[:site_slug]})
               .order(params[:order] || 'created_at ASC')

    respond_to do |format|
      format.html { render :structure }
      format.json { render json: @pages }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_site
    @site = Site.find_by({slug: params[:site_slug]})
  end

end
