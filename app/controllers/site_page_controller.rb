class SitePageController < ApplicationController
  before_action :load_site_page
  before_action :load_menu
  before_action :load_breadcrumbs
  before_action :get_active_menu_item
  before_action :load_logo_image
  before_action :create_menu_tree, only: [:not_found, :internal_server_error, :unacceptable]
  protect_from_forgery except: :map_resources

  def load_site_page
    @site_page = SitePage.find(params[:id])

    redirect_to not_found_path unless @site_page && @site_page.visible?
  end

  def load_menu
    @menu_root = @site_page.site.root
  end

  def load_breadcrumbs
    @breadcrumbs = []
    page = @site_page

   begin
      @breadcrumbs << page
      page = page.parent
    end while !page.nil?

    @breadcrumbs = @breadcrumbs.reverse
  end

  def load_logo_image
    image_setting = SiteSetting.logo_image(@site_page.site.id)
    @image_url = '/'
    @image_url = image_setting.image if !image_setting.blank? && !image_setting.image_file_name.blank?
  end

  def homepage
  end

  def open_content
  end

  def static_content
  end

  def map_resources
  end

  def analysis_dashboard
    @setting = @site_page.dataset_setting
    if @setting
      # Query the API in the dataset_setting

      # Fill the gon for:
      # ... user filters
      gon.analysis_user_filters = JSON.parse @setting.columns_changeable
      # ... default graphs (type: {X,Y})
      gon.analysis_graphs = JSON.parse @setting.default_graphs
      # ... default map (type: {up_left, right_bottom})
      gon.analysis_map = JSON.parse @setting.default_map
      # ... data
      gon.analysis_data = @setting.get_filtered_dataset
      # ... last modification of the fields
      gon.analysis_timestamp = @setting.fields_last_modified
      # ... legend fields
      gon.legend = @setting.legend
    end
  end

  def map_report
  end

  def get_active_menu_item
    if @site_page.root?
      @active_menu_item = nil
    else
      @active_menu_item = get_menu_item @site_page.clone
    end
  end

  # 404
  # GET /not_found
  def not_found
  end

  # 500
  def internal_server_error
  end

  # 422
  def unacceptable
  end

  private

  def get_menu_item(node)
    if node.parent.root?
      return node.id
    else
      get_menu_item node.parent
    end
  end

  def create_menu_tree
    @menu_tree = @menu_root.hash_tree
  end

end
