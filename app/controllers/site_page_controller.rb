class SitePageController < ApplicationController
  include AuthHelper

  before_action :load_site_page
  before_action :set_gon
  before_action :load_menu
  before_action :load_breadcrumbs
  before_action :get_active_menu_item
  before_action :load_images
  before_action :load_flag
  before_action :create_menu_tree, only: [:not_found, :internal_server_error, :unacceptable, :sitemap]
  protect_from_forgery except: :map_resources

  def load_site_page
    @site_page = SitePage.find(params[:id])

    redirect_to not_found_path unless @site_page && @site_page.visible?
  end

  def set_gon
    gon.push({
               :default_site_language => @site_page.site.site_settings.default_site_language(@site_page.site_id).value || 'en',
               :translations => {
                 :en => @site_page.site.site_settings.translate_english(@site_page.site_id).value == '1',
                 :fr => @site_page.site.site_settings.translate_french(@site_page.site_id).value == '1',
                 :es => @site_page.site.site_settings.translate_spanish(@site_page.site_id).value == '1',
                 :ka => @site_page.site.site_settings.translate_georgian(@site_page.site_id).value == '1'
               }
             })
    gon.page = @site_page
    gon.content = OpenStruct.new(@site_page.content).json
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

  def load_images
    logo_image_setting = SiteSetting.logo_image(@site_page.site.id)
    @image_url = '/'
    @image_url = logo_image_setting.image if !logo_image_setting.blank? && !logo_image_setting.image_file_name.blank?

    main_image_setting = SiteSetting.main_image(@site_page.site.id)
    @main_image = main_image_setting.image if !main_image_setting.blank? && !main_image_setting.image_file_name.blank?

    alternative_image_setting = SiteSetting.alternative_image(@site_page.site.id)
    @alternative_image = alternative_image_setting.image if !alternative_image_setting.blank? && !alternative_image_setting.image_file_name.blank?

    favico_image_setting = SiteSetting.favico(@site_page.site.id)
    @favico = favico_image_setting.image if !favico_image_setting.blank? && !favico_image_setting.image_file_name.blank?

    gon.main_image = @main_image
    gon.alternative_image = @alternative_image
  end

  def load_flag
    begin
      @flag = SiteSetting.flag_colors(@site_page.site.id)
      @flag = @flag.value.split(' ')
    rescue Exception => e
      @flag = []
      logger.error("Error when accessing the flag colors for site: #{@site_page.site.name}: #{e}")
    end
  end

  def homepage
  end

  def open_content
  end

  def static_content
  end

  def login
  end

  def login_redirect
    token = params[:token]

    if token.blank?
      redirect_to controller: 'site_page', action: 'homepage',
                  id: @site_page.site.id and return
    end

    session[:user_token] = token
    ensure_logged_in
    session[:current_user]

    redirect_to controller: 'site_page', action: 'homepage',
                id: @site_page.site.id
  end

  def logout
    session.delete(:user_token)
    session.delete(:current_user)
    redirect_to request.referrer
  end

  def analysis_dashboard
    gon.page_name = @site_page.name

    @setting = @site_page.dataset_setting
    if @setting
      # Query the API in the dataset_setting

      # Fill the gon for:
      # ... user filters
      gon.analysis_user_filters = JSON.parse @setting.columns_changeable
      # ... widgets
      gon.analysis_widgets = @setting.widgets.blank? ? nil : (JSON.parse @setting.widgets)
      # ... data
      gon.analysis_data = @setting.get_filtered_dataset
      # ... metadata
      gon.metadata = Dataset.get_metadata_for_frontend(session[:user_token], @setting.dataset_id)
      # ... last modification of the fields
      gon.analysis_timestamp = @setting.fields_last_modified
      # ... legend fields
      gon.legend = @setting.legend
    end
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
    render :not_found => true, :status => 404
  end

  # 500
  def internal_server_error
  end

  # 422
  def unacceptable
  end

  def sitemap
    respond_to do |format|
      format.html { render :sitemap }
      format.xml
    end
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
