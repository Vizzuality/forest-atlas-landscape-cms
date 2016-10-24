class Management::SitesController < ManagementController
  before_action :set_site, only: [:structure]
  before_action :get_pages, only: [:structure, :update_structure]

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
    gon.updateStructurePath = management_site_update_structure_path(@site)

    respond_to do |format|
      format.html {
        build_pages_tree
        render :structure }
      format.json { render json: @pages }
    end
  end

  def update_structure
    puts params.inspect

    #@pages.each do |page|
    #  puts params['collection'].first
    #end

    redirect_to management_site_site_pages_path(@site)
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_site
    @site = Site.find_by({slug: params[:site_slug]})

    if (@site.routes.any?)
      # We just want a valid URL for the site
      @url = @site.routes.first.host
    end
  end

  def build_pages_tree
    tree = Page.where(site_id: @site.id).select(:id, :name, :parent_id, :position, :enabled, :type).hash_tree
    formatted_tree = format_tree tree.keys.first, tree.values.first
    gon.structure = formatted_tree
  end


  def format_tree(node_key, node_value)
    tree = {id: node_key.id, name: node_key.name, parent_id: node_key.parent_id,
            position: node_key.position, enabled: node_key.enabled, type: node_key.type}
    unless node_value.blank?
      children = []
      node_value.each do |key, value|
        children << format_tree(key,value)
      end
      tree.merge!({children: children})
    end
    return tree
  end

  def get_pages
    @pages = SitePage.joins(:users)
               .where(users: {id: current_user.id})
               .where(sites: {slug: params[:site_slug]})
               .order(params[:order] || 'created_at ASC')
  end

end
