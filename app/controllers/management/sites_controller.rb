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
      format.html {
        build_pages_tree
        render :structure }
      format.json { render json: @pages }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_site
    @site = Site.find_by({slug: params[:site_slug]})
  end

  def build_pages_tree
    tree = Page.where(site_id: @site.id).select(:id, :name, :parent_id, :position, :enabled).hash_tree
    formatted_tree = format_tree tree.keys.first, tree.values.first
    gon.structure = formatted_tree
  end


  def format_tree(node_k, node_v)
    h = {id: node_k.id, name: node_k.name, parent_id: node_k.parent_id, position: node_k.position, enabled: node_k.enabled}
    unless node_v.blank?
      children = []
      node_v.each do |k, v|
        children << format_tree(k,v)
      end
      h.merge!({children: children})
    end
    return h
  end
end
