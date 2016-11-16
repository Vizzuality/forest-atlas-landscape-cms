class Management::SitePagesController < ManagementController
  before_action :set_page, only: [:show, :edit, :update, :destroy, :toggle_enable]
  before_action :set_site, only: [:index, :new, :create]
  before_action :authenticate_user_for_site!, only: [:index, :new, :create]
  before_action :set_content_type_variables, only: [:new, :edit]

  # GET /management/:site_slug
  # GET /management/:site_slug.json
  def index
    @pages = SitePage.joins(:site)
               .where(sites: {slug: params[:site_slug]})
               .paginate(:page => params[:page], :per_page => params[:per_page])
               .order(params[:order] || 'created_at ASC')

    gon.pages = @pages.map do |page|
      {
        'title' => {'value' => page.name, 'searchable' => true, 'sortable' => true},
        'url' => {'value' => page.url, 'searchable' => true, 'sortable' => true},
        'type' => {'value' => page.content_type_humanize, 'searchable' => false, 'sortable' => true},
        'enabled' => {'value' => page.enabled},
        'enable' => {'value' => toggle_enable_management_site_page_path(page), 'method' => 'put'},
        'edit' => {'value' => edit_management_site_page_path(page), 'method' => 'get'},
        'delete' => {'value' => management_site_page_path(page), 'method' => 'delete'}
      }
    end

    respond_to do |format|
      format.html { render :index }
      format.json { render json: @pages }
    end
  end

  # GET /management/pages/1
  # GET /management/pages/1.json
  def show
    case @site_page.content_type
      when ContentType::OPEN_CONTENT
        @breadcrumbs = ['Page creation', 'Open Content']
      when ContentType::ANALYSIS_DASHBOARD
        @breadcrumbs = ['Page creation', 'Analysis Dashboard']
      when ContentType::DYNAMIC_INDICATOR_DASHBOARD
        @breadcrumbs = ['Page creation', 'Dynamic Indicator Dashboard']
      when ContentType::HOMEPAGE
        @breadcrumbs = ['Page creation', 'Homepage']
      when ContentType::LINK
        @breadcrumbs = ['Page creation', 'External Link']
      when ContentType::MAP
        @breadcrumbs = ['Page creation', 'Map']
      when ContentType::STATIC_CONTENT
        @breadcrumbs = ['Page creation', 'Static Content']
      else
        @breadcrumbs = ['Page creation']
    end
  end

  # GET /management/pages/new
  def new
    session[:new_page_parent] = params[:parent] if params[:parent]
  end

  # GET /management/pages/1/edit
  def edit
  end

  # POST /management/pages
  # POST /management/pages.json
  def create
    @site_page = @site.site_pages.build(page_params)
    @site_page.enabled = false

    @site_page.parent_id = session[:new_page_parent]
    session[:new_page_parent] = nil

    if @site_page.parent_id.blank?
      @site_page.parent_id = @site.site_pages.where(url: '/').first.id
      @site_page.position = @site.site_pages.where(parent_id: @site_page.parent).length
    elsif @site_page.position.blank?
      @site_page.position = @site.site_pages.where(parent_id: @site_page.parent).length
    end

    respond_to do |format|
      if @site_page.save
        format.html { redirect_to management_site_page_path(@site_page) }
        format.json { render :show, status: :created, location: @site_page }
      else
        format.html { render :new }
        format.json { render json: @site_page.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /management/pages/1
  # PATCH/PUT /management/pages/1.json
  def update
    respond_to do |format|
      if @site_page.update(page_params)
        format.html { redirect_to management_site_page_path(@site_page), notice: 'SitePage was successfully updated.' }
        format.json { render :show, status: :ok, location: @site_page }
      else
        format.html { render :edit }
        format.json { render json: @site_page.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /management/pages/1
  # DELETE /management/pages/1.json
  def destroy
    site = @site_page.site
    @site_page.destroy
    respond_to do |format|
      format.html { redirect_to({'controller' => 'management/site_pages', 'action' => 'index', 'site_slug' => site.slug}, {notice: 'SitePage was successfully destroyed.'}) }
      format.json { head :no_content }
    end
  end


  def toggle_enable
    @site_page.enabled = !@site_page.enabled
    @site_page.save

    redirect_to management_site_site_pages_path(@site.slug)
  end

  private

  def set_content_type_variables
    @site_page = SitePage.new(content_type: params['type'].to_i) if @site_page.nil?
    @is_creation = action_name == 'new'

    case @site_page.content_type
      when ContentType::OPEN_CONTENT
        @partial = 'open_content'
        @breadcrumbs = [@is_creation ? 'Page creation': 'Page edition', 'Open Content']
      when ContentType::ANALYSIS_DASHBOARD
        @partial = 'analysis_dashboard'
        @breadcrumbs = [@is_creation ? 'Page creation': 'Page edition', 'Analysis Dashboard']
      when ContentType::DYNAMIC_INDICATOR_DASHBOARD
        @partial = 'dynamic_indicator_dashboard'
        @breadcrumbs = [@is_creation ? 'Page creation': 'Page edition', 'Dynamic Indicator Dashboard']
      when ContentType::HOMEPAGE
        @partial = 'homepage'
        @breadcrumbs = [@is_creation ? 'Page creation': 'Page edition', 'Homepage']
      when ContentType::LINK
        @partial = 'link'
        @breadcrumbs = [@is_creation ? 'Page creation': 'Page edition', 'External Link']
      when ContentType::MAP
        @partial = 'map'
        @breadcrumbs = [@is_creation ? 'Page creation': 'Page edition', 'Map']
      when ContentType::STATIC_CONTENT
        @partial = 'static_content'
        @breadcrumbs = [@is_creation ? 'Page creation': 'Page edition', 'Static Content']
      else
        @partial = 'select_type'
        @breadcrumbs = [@is_creation ? 'Page creation': 'Page edition']
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_site
    @site = Site.find_by({slug: params[:site_slug]})

    if (@site.routes.any?)
      # We just want a valid URL for the site
      @url = @site.routes.first.host
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_page
    @site_page = SitePage.find(params[:id])
    @site = @site_page.site
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def page_params
    all_options = params.require(:site_page).fetch(:content, nil).try(:permit!)
    params.require(:site_page).permit(:name, :description, :site_id, :uri, :parent_id, :content_type, :show_on_menu).merge(:content => all_options)
  end

end
