# Helper to create a Tree Structure for a @site
module TreeStructureHelper

  # Creates a closure tree for a site
  def build_pages_tree
    # The hash_tree method returns a hash that for each node has a SitePage ...
    # ... as the key, and an array of hashes for values
    tree = Page.where(site_id: @site.id).select(:id, :name, :parent_id, :position, :enabled, :content_type, :show_on_menu).hash_tree
    return format_tree tree.keys.first, tree.values.first
  end

  # Formats the tree to send it to Backbone through gon
  def format_tree(node_key, node_value)
    tree = {id: node_key.id, name: node_key.name, parent_id: node_key.parent_id,
            position: node_key.position, enabled: node_key.enabled, content_type: node_key.content_type,
            disableable: node_key.disableable?, deleteUrl: management_site_site_page_path(@site.slug, node_key.id),
            editUrl: edit_management_site_site_page_page_step_path(@site.slug, node_key.id, 'position')}
    unless node_value.blank?
      children = []
      node_value.each do |key, value|
        children << format_tree(key,value) if key.show_on_menu
      end
      tree.merge!({children: children})
    end
    return tree
  end
end
