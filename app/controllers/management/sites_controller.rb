class Management::SitesController < ManagementController
  before_action :set_site, only: [:structure, :update_structure]
  before_action :get_pages, only: [:structure, :update_structure]

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
    gon.addPagePath = new_management_site_site_page_path(@site.slug)

    respond_to do |format|
      format.html {
        build_pages_tree
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

  # Creates a closure tree for a site
  def build_pages_tree
    # The hash_tree method returns a hash that for each node has a SitePage ...
    # ... as the key, and an array of hashes for values
    tree = Page.where(site_id: @site.id).select(:id, :name, :parent_id, :position, :enabled, :content_type).hash_tree
    formatted_tree = format_tree tree.keys.first, tree.values.first
    gon.structure = formatted_tree
  end

  # Formats the tree to send it to Backbone through gon
  def format_tree(node_key, node_value)
    tree = {id: node_key.id, name: node_key.name, parent_id: node_key.parent_id,
            position: node_key.position, enabled: node_key.enabled, content_type: node_key.content_type,
            disableable: node_key.disableable?, deleteUrl: management_site_site_page_path(@site.slug, node_key.id),
            editUrl: edit_management_site_site_page_path(@site.slug, node_key.id)}
    unless node_value.blank?
      children = []
      node_value.each do |key, value|
        children << format_tree(key,value)
      end
      tree.merge!({children: children})
    end
    return tree
  end

  # Gets all the pages of the site
  def get_pages
    @pages = SitePage.joins(:users)
               .where(users: {id: current_user.id})
               .where(sites: {slug: params[:site_slug]})
               .order(params[:order] || 'created_at ASC')
  end

end
