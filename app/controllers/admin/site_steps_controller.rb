class Admin::SiteStepsController < AdminController
  include Wicked::Wizard
  include NavigationHelper

  URL_CONTROLLER_ID = 'site_routes_attributes'.freeze
  URL_CONTROLLER_NAME = 'site[routes_attributes]'.freeze
  COLOR_CONTROLLER_ID = 'site_site_settings_attributes_5'.freeze
  COLOR_CONTROLLER_NAME = 'site[site_settings_attributes][5]'.freeze

  SAVE = 'Save Changes'.freeze
  CONTINUE = 'Continue'.freeze

  steps *Site.form_steps[:pages]
  attr_accessor :steps_names
  helper_method :disable_button?
  helper_method :active_button?

  before_action :get_site_pages

  # This action cleans the session
  def new
    session[:site] = {}
    redirect_to admin_site_step_path(id: :name)
  end

  # This action cleans the session
  def edit
    session[:site] = {}
    redirect_to admin_site_site_step_path(site_slug: params[:site_slug], id: :name)
  end

  def show
    @breadcrumbs << {name: current_site.id ? 'Editing "'+current_site.name+'"' : 'New Site'}

    if step == 'name'
      @site = current_site
      gon.global.url_controller_id = URL_CONTROLLER_ID
      gon.global.url_controller_name = URL_CONTROLLER_NAME
      gon.global.url_array = @site.routes.to_a
    else
      @site = current_site
      if step == 'users'
        @users = User.where('admin is not true')
      end
      if step == 'style'
        SiteSetting.create_color_settings @site
      end
      if step == 'settings'
        SiteSetting.create_additional_settings @site
        gon.global.color_controller_id = COLOR_CONTROLLER_ID
        gon.global.color_controller_name = COLOR_CONTROLLER_NAME

        color_array = @site.site_settings.where(name: 'flag').first
        gon.global.color_array = color_array[:value].split(' ').map { |x| {color: x} } if color_array

        @logo_image = @site.site_settings.where(name: 'logo_image').first
        @main_image = @site.site_settings.where(name: 'main_image').first
        @alternative_image = @site.site_settings.where(name: 'alternative_image').first
        @favico = @site.site_settings.where(name: 'favico').first
      end
    end
    render_wizard
  end

  def update
    case step
      when 'name'
        @site = current_site

        # If the user pressed the save button
        if save_button?
          if @site.save
            redirect_to admin_sites_path
          else
            render_wizard
          end
        else
          @site.form_step = 'name'
          session[:site] = site_params.to_h

          if @site.valid?
            redirect_to next_wizard_path
          else
            render_wizard
          end
        end

      when 'users'
        @site = current_site
        unless params[:site].blank?
          if save_button?
            if @site.save
              redirect_to admin_sites_path
            else
              @users = User.where('admin is not true')
              render_wizard
            end
          else
            @site.form_step = 'users'

            if @site.valid?
              redirect_to next_wizard_path
            else
              @users = User.where('admin is not true')
              render_wizard
            end
          end
        else
          @site = Site.new
          @site.errors.add(:users, 'Site must have at least one user')
          @users = User.where('admin is not true')
          render_wizard
        end

      when 'style'
        @site = current_site
        if save_button?
          if @site.save
            redirect_to admin_sites_path
          else
            render_wizard
          end
        else
          @site.form_step = 'style'

          if @site.valid?
            redirect_to next_wizard_path
          else
            render_wizard
          end
        end

      # In this step, the site is always saved
      when 'settings'
        settings = site_params.to_h
        @site = params[:site_slug] ? Site.find_by(slug: params[:site_slug]) : Site.new(session[:site])

        begin
          # If the user is editing
          if @site.id
            @site.site_settings.each do |site_setting|
              setting = settings[:site_settings_attributes].values.select { |s| s['id'] == site_setting.id.to_s }
              site_setting.assign_attributes setting.first.except('id', 'position', 'name') if setting.any?
            end
            # If the user is creating a new site
          else
            settings[:site_settings_attributes].map { |s| @site.site_settings.build(s[1]) }
            @site.form_step = 'settings'
          end
        end

        if @site.save
          redirect_to next_wizard_path
        else
          render_wizard
        end
    end
  end

  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def site_params
    params.require(:site).
      permit(:name, :site_template_id,
             user_ids: [],
             routes_attributes: [:host],
             site_settings_attributes: [:id, :position, :value, :name, :image])
  end

  def current_site
    site = params[:site_slug] ? Site.find_by(slug: params[:site_slug]) : Site.new
    session[:site].merge!(site_params.to_h) if params[:site] && site_params.to_h
    site.assign_attributes session[:site] if session[:site]
    site
  end

  def save_button?
    params[:button].upcase == SAVE.upcase
  end

  def get_site_pages
    self.steps_names = *Site.form_steps[:names]
  end
end
