class Management::SitesController < ManagementController
  include TreeStructureHelper
  before_action :set_site, only: %i[structure update_structure
                                    associations update_associations]
  before_action :get_pages, only: %i[structure update_structure]
  before_action :authenticate_user_for_site!
  before_action :authorize, only: %i[associations update_associations]


  # GET /management/sites
  # GET /management/sites.json
  def index
    @sites = Site.joins(:users)
               .where(users: {id: current_user.id})
               .order(params[:order] || 'created_at ASC')

    respond_to do |format|
      format.html { redirect_to management_path }
      format.json { render json: @sites }
    end
  end

  # GET /management/:site_slug/structure
  # GET /management/:site_slug/structure.json
  def structure
    gon.updateStructurePath = management_site_update_structure_path(@site.slug)
    gon.addPagePath = new_management_site_page_step_path(@site.slug)

    respond_to do |format|
      format.html {
        gon.structure = build_pages_tree
        render :structure }
      format.json { render json: @pages }
    end
  end

  def update_structure
    new_tree = params['collection'].first
    update_tree_nodes(new_tree, nil, 0)

    redirect_to action: "structure", anchor: "success"
  end

  def associations
    @site.build_user_site_associations_for_users(non_admin_users)
  end

  def update_associations
    user_site_associations_attributes = {}
    if site_params[:user_site_associations_attributes]
      site_params[:user_site_associations_attributes].to_h.each do |i, usa|
        usa['_destroy'] = true if usa['selected'] != '1'
        user_site_associations_attributes[i] = usa
      end
      @site.user_site_associations_attributes =
        user_site_associations_attributes
      @site.save
      redirect_to "/management/sites/#{@site.slug}/users",
                  notice: 'Publishers updated'
    else
      redirect_to "/management/sites/#{@site.slug}/users",
                  error: 'There was a problem with the request'
    end
  end

  private
  # Update the tree nodes to their current position
  def update_tree_nodes(node, parent_id, position)
    page = SitePage.find node['id']
    page.parent_id = parent_id
    page.position = position
    page.enabled = node['enabled']
    page.save
    unless node['children'].blank?
      node['children'].each_with_index do |leaf, index|
        update_tree_nodes leaf, node['id'], index
      end
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_site
    @site = Site.find_by({slug: params[:site_slug]})

    if (@site.routes.any?)
      # We just want a valid URL for the site
      @url = @site.routes.first.host_with_scheme
    end
  end

  # Gets all the pages of the site
  def get_pages
    @pages = SitePage.joins(:users)
               .where(users: {id: current_user.id})
               .where(sites: {slug: params[:site_slug]})
               .order(params[:order] || 'created_at ASC')
  end

  def authorize
    unless user_site_manager?(@site)
      flash[:error] = 'You do not have permissions to view this page'
      redirect_to :no_permissions
    end
  end

  def non_admin_users
    User.where(admin: false).order(:name)
  end

  def site_params
    params.require(:site)
      .permit(user_site_associations_attributes: [:id, :user_id, :role, :selected])
  end
end
