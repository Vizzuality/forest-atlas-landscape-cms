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
        'edit' => {'value' => edit_admin_site_path(site), 'method' => 'get'},
        'delete' => {'value' => admin_site_path(site), 'method' => 'delete'}
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
=begin
    @site = Site.new(site_params)

    respond_to do |format|
      if @site.save
        format.html { redirect_to admin_site_setting_path(@site) }
        format.json { render :show, status: :created, location: @site }
      else
        format.html { render :new }
        format.json { render json: @site.errors, status: :unprocessable_entity }
      end
    end
=end
  end

  # PATCH/PUT /admin/sites/1
  # PATCH/PUT /admin/sites/1.json
  def update
    respond_to do |format|
      case step
        when :name
          @site = Site.new(site_params)
          if @site.valid?
            session[:site] = site.attributes
            redirect_to next_wizard_path
          else
            render_wizard
          end
        when :users
        when :style
        when :settings
        when :finish

      end



=begin
      if @site.update(site_params)
        format.html {
          case params['site']['step']
            when '1'
              redirect_to admin_site_setting_path(@site)
            when '2'
              redirect_to admin_site_user_path(@site)
            when '3'
              redirect_to display_admin_site_path(@site), notice: 'Site was successfully created! '
          end
        }
        format.json { render :show, status: :ok, location: @site }
      else
        format.html {
          case params['site']['step']
            when '1'
              render :edit
            when '2'
              render 'admin/site_settings/show'
            when '3'
              render 'admin/site_users/edit'
          end
        }
        format.json { render json: @site.errors, status: :unprocessable_entity }
      end
=end

    end
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
    @site = Site.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def site_params
    params.require(:site).permit(:name, :site_template_id,
                                 {user_ids: []}, site_routes_attributes: [:id, :host, :path], site_settings_attributes: [:id, :value, :name, :image])
  end
end
