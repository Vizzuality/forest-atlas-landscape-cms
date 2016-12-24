class Admin::SitesController < AdminController

  before_action :set_site, only: [:show, :edit, :update, :destroy, :display]


  # GET /admin/sites
  # GET /admin/sites.json
  def index
    @sites = Site.paginate(:page => params[:page], :per_page => params[:per_page]).order(params[:order] || 'created_at ASC')

    gon.sites = @sites.map do |site|
      {
        'title' => {'value' => site.name, 'searchable' => true, 'sortable' => true},
        'template' => {'value' => site.site_template.name, 'searchable' => true, 'sortable' => true},
        'edit' => {'value' => edit_admin_site_site_step_path(site_slug: site.slug, id: :name), 'method' => 'get'},
        'delete' => {'value' => admin_site_path(slug: site.slug), 'method' => 'delete'}
      }
    end

    respond_to do |format|
      format.html { render :index }
      format.json { render json: @sites }
    end
  end

  # GET /admin/sites/1
  # GET /admin/sites/1.json
  def show
    respond_to do |format|
      format.html { render :show }
      format.json { render json: @site }
    end
  end

  # GET /admin/sites/new
  def new
    @site = Site.new

    gon.urlControllerId = URL_CONTROLLER_ID
    gon.urlControllerName = URL_CONTROLLER_NAME
    gon.urlArray = @site.routes

    render_wizard
  end

  # GET /admin/sites/1/edit
  def edit
    @site ||= Site.new
  end

  # POST /admin/sites
  # POST /admin/sites.json
  def create
  end

  # PATCH/PUT /admin/sites/1
  # PATCH/PUT /admin/sites/1.json
  def update
  end

  # DELETE /admin/sites/1
  # DELETE /admin/sites/1.json
  def destroy
    @site.destroy

    respond_to do |format|
      format.html { redirect_to admin_sites_url, notice: 'Site was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_site
    @site = Site.find_by slug: params[:slug]
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def site_params
    params.require(:site).permit(:name, :site_template_id,
                                 {user_ids: []}, site_routes_attributes: [:id, :host, :path], site_settings_attributes: [:id, :value, :name, :image])
  end
end
