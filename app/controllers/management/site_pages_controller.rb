class Management::SitePagesController < ManagementController
  before_action :ensure_management_user, only: :destroy
  before_action :set_page, only: [:destroy, :toggle_enable]
  before_action :set_site, only: :index
  before_action :authenticate_user_for_site!

  # GET /management/:site_slug
  # GET /management/:site_slug.json
  def index
    @pages = SitePage.joins(:site)
               .where(sites: {slug: params[:site_slug]})
               .order(params[:order] || 'created_at ASC')

    site = Site.find_by(slug: params[:site_slug])
    admin = current_user.admin? || user_site_admin?(site.id)

    @formattedPages = @pages.map do |page|
      delete = if !admin
                 {'value' => nil}
               else
                 if page.deletable?
                   {'value' => management_site_site_page_path(page.site.slug, page), 'method' => 'delete'}
                 else
                   {'value' => nil}
                 end
               end

      res = {
        'title' => {'value' => page.name, 'searchable' => true, 'sortable' => true, 'link' => { 'url' => page.site.routes.first.host_with_scheme + page.url, 'external' => true }},
        'url' => {'value' => page.url, 'searchable' => true, 'sortable' => true},
        'type' => {'value' => page.content_type_humanize, 'searchable' => false, 'sortable' => true},
        'enabled' => {'value' => page.enabled},
        'enable' => page.disableable? ? \
          {'value' => toggle_enable_management_site_site_page_path(page.site.slug, page), 'method' => 'put'} : \
          {'value' => nil},
        'edit' => {'value' => edit_management_site_site_page_page_step_path(page.site.slug, page, :position), \
                   'method' => 'get'},
        'delete' => delete
      }

      res
    end

    # keep this for now, untill backbone is removed, we still need it
    gon.pages = @formattedPages

    respond_to do |format|
      format.html { render :index }
      format.json { render json: @pages }
    end
  end

  # GET /management/pages/1
  # GET /management/pages/1.json
  def show
  end

  # DELETE /management/pages/1
  # DELETE /management/pages/1.json
  def destroy
    site = @site_page.site
    unless @site_page.deletable?
      respond_to do |format|
        format.html {
          redirect_to(
            {'controller' => 'management/site_pages', 'action' => 'index', 'site_slug' => site.slug},
            {alert: 'Page cannot be destroyed.'}
          )
        }
        format.json { head :no_content }
      end
      return
    end

    @site_page.destroy
    respond_to do |format|
      format.html {
        redirect_to(
          {'controller' => 'management/site_pages', 'action' => 'index', 'site_slug' => site.slug},
          {notice: 'Page was successfully destroyed.'}
        )
      }
      format.json { head :no_content }
    end
  end


  def toggle_enable
    return unless @site_page.disableable?

    @site_page.enabled = !@site_page.enabled
    @site_page.save

    redirect_to management_site_site_pages_path(@site.slug), notice: 'Visibility was successfully updated.'
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_site
    @site = Site.find_by_slug!(params[:site_slug])

    if (@site.routes.any?)
      # We just want a valid URL for the site
      @url = @site.routes.first.host_with_scheme
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
    params.require(:site_page).permit(:name, :description, :site_id, :uri, :parent_id, :content_type, :show_on_menu, :page_version).merge(:content => all_options)
  end

end
