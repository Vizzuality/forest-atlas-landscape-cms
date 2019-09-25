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

  MAX_PAGE_SIZE = 6

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

    if main_images_settings = SiteSetting.main_images(@site_page.site.id)
      @homepage_covers = []
      main_images_settings.each do |image|
        attribution =
          if image.attribution_label.present? || image.attribution_link.present?
            { url: image.attribution_link, label: image.attribution_label }
          end
        @homepage_covers << {
          url: image.image.url,
          attribution: attribution
        }
      end
    end

    if alternative_image_setting = SiteSetting.alternative_image(@site_page.site.id)
      attribution =
        if alternative_image_setting.attribution_label.present? || alternative_image_setting.attribution_link.present?
          { url: alternative_image_setting.attribution_link, label: alternative_image_setting.attribution_label }
        end
      @page_cover = if @site_page.cover_image.present?
                      [{
                         url: @site_page.cover_image.url,
                         attribution: {url: nil, label: nil}
                       }]
                    else
                      [{
                         url: alternative_image_setting.image.url,
                         attribution: attribution
                       }]
                    end
    end

    favico_image_setting = SiteSetting.favico(@site_page.site.id)
    @favico = favico_image_setting.image if !favico_image_setting.blank? && !favico_image_setting.image_file_name.blank?
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

  def open_content_v2
  end

  def static_content
  end

  def map
    build_map_variables
  end

  def map_report
    build_map_variables
    # @remove_header = true
  end

  def feedback
    @contact_email = SiteSetting.contact_email_address(@site_page.site_id).value rescue nil
    # Overriding the homepage properties to display the values for the feedback page
    @site_page.name = 'Feedback'
    @site_page.description = 'Page for the users to provide feedback'
    @authenticity_token = session[:_csrf_token] ||= SecureRandom.base64(32)
  end

  def login
    @return_link = request.headers['HTTP_REFERER'].remove(request.base_url) || '' rescue ''
    @return_link = '?page=' + @return_link unless @return_link.blank?
  end

  def login_redirect
    token = params[:token]
    page = params[:page]

    if token.blank?
      redirect_to controller: 'site_page', action: 'homepage',
                  id: @site_page.site.id and return
    end

    session[:user_token] = token
    ensure_logged_in
    session[:current_user]

    if page.blank?
      redirect_to controller: 'site_page', action: 'homepage',
                  id: @site_page.site.id
    else
      redirect_to request.base_url + page
    end
  end

  def logout
    session.delete(:user_token)
    session.delete(:current_user)
    redirect_to request.referrer
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

  def search_results
    @search_string = params[:search] || ''
    @page_number = params[:page].to_i > 0 ? params[:page].to_i : 1 rescue 1
    @search_results = []
    @total_pages = 1
    return if @search_string.blank?

    @search_results =
      SitePage.not_tag_page
        .not_link_page.not_group_page
        .search(@search_string)
        .for_site(@site_page.site_id).enabled
        .limit(MAX_PAGE_SIZE)
        .offset((@page_number - 1) * MAX_PAGE_SIZE)
    @total_pages =
      SitePage.not_tag_page
        .not_link_page.not_group_page
        .search_tags(@search_string)
        .for_site(@site_page.site_id).enabled.count
    @total_pages = (@total_pages / MAX_PAGE_SIZE) + 1
  end

  def tag_searching
    @search_string = @site_page.content.join(' ') rescue ''
    @search_results = []
    @total_pages = 1
    @page_number = params[:page].to_i > 0 ? params[:page].to_i : 1 rescue 1
    return if @search_string.blank?

    @search_results =
      SitePage.not_tag_page
        .not_link_page.not_group_page
        .search_tags(@search_string)
        .for_site(@site_page.site_id).enabled
        .limit(MAX_PAGE_SIZE)
        .offset((@page_number - 1) * MAX_PAGE_SIZE)
    @total_pages =
      SitePage.not_tag_page
        .not_link_page.not_group_page
        .search(@search_string)
        .for_site(@site_page.site_id).enabled.count
    @total_pages = (@total_pages / MAX_PAGE_SIZE) + 1
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

  def build_map_variables
    begin
      @map_html = MapVersion.find_by(version: @site_page.content['version']).html
    rescue
      @map_html = ''
    end

    if @site_page.content.nil?
      @map_content =  '{}'
    elsif @site_page.content['settings'].is_a? Hash
      @map_content = @site_page.content['settings']
      @map_content['layerPanel'] = JSON.parse(@map_content['layerPanel']) rescue {}
      @map_content['analysisModules'] = JSON.parse(@map_content['analysisModules']) rescue {}
      @map_content['narrative'] = @map_content['narrative'].gsub('"', '\\"') rescue ''
      @map_content = @map_content.to_json.squish.gsub("'", %q(\\\')).html_safe
    else
      @map_content = @site_page.content['settings'].to_s.squish.gsub("'", %q(\\\')).html_safe
    end
  end
end
