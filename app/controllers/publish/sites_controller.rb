class Publish::SitesController < PublishController
  include TreeStructureHelper
  before_action :set_site, only: [:structure, :update_structure]
  before_action :get_pages, only: [:structure, :update_structure]
  before_action :authenticate_user_for_site!

  # GET /management/sites
  # GET /management/sites.json
  def index
    @sites = Site.joins(:users)
               .where(users: {id: current_user.id})
               .paginate(:page => params[:page], :per_page => params[:per_page])
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
      @url = @site.routes.first.host
    end
  end

  # Gets all the pages of the site
  def get_pages
    @pages = SitePage.joins(:users)
               .where(users: {id: current_user.id})
               .where(sites: {slug: params[:site_slug]})
               .order(params[:order] || 'created_at ASC')
  end

end
