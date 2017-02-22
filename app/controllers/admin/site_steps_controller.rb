class Admin::SiteStepsController < AdminController
  require 'rake'

  include Wicked::Wizard
  include NavigationHelper

  URL_CONTROLLER_ID = 'site_routes_attributes'.freeze
  URL_CONTROLLER_NAME = 'site[routes_attributes]'.freeze
  COLOR_CONTROLLER_ID = 'site_site_settings_attributes_3'.freeze
  COLOR_CONTROLLER_NAME = 'site[site_settings_attributes][3]'.freeze

  SAVE = 'Save Changes'.freeze
  CONTINUE = 'Continue'.freeze

  steps *Site.form_steps[:pages]
  attr_accessor :steps_names
  helper_method :disable_button?
  helper_method :active_button?

  before_action :get_site_pages
  before_action :set_site_id, only: [:new, :edit, :update, :show]
  prepend_before_action :ensure_session_keys_exist, only: [:new, :edit, :show, :update]

  # This action cleans the session
  def new
    reset_session_key(:site, @site_id, {})
    redirect_to admin_site_step_path(id: :name)
  end

  # This action cleans the session
  def edit
    reset_session_key(:site, @site_id, {})
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
      if step == 'managers'
        @managers = User.where(role: UserType::MANAGER)
      end
      if step == 'publishers'
        @publishers = User.where(role: UserType::PUBLISHER)
      end
      if step == 'contexts'
        @contexts = Context.all
      end
      if step == 'style'
        SiteSetting.create_color_settings @site
      end
      if step == 'style_settings'
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
      if step == 'site_settings'
        SiteSetting.create_site_settings @site
        @translate_english = @site.site_settings.where(name: 'translate_english').first
        @translate_spanish = @site.site_settings.where(name: 'translate_spanish').first
        @translate_french = @site.site_settings.where(name: 'translate_french').first
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
            redirect_to admin_sites_path, notice: 'The site\'s main color might take a few minutes to be visible'
          else
            render_wizard
          end
        else
          @site.form_step = 'name'
          session[:site][@site_id] = site_params.to_h

          if @site.valid?
            redirect_to next_wizard_path
          else
            render_wizard
          end
        end

      # TODO: REFACTOR THIS
      when 'managers'
        @site = current_site
        if save_button?
          if @site.save
            redirect_to admin_sites_path, notice: 'The site\'s main color might take a few minutes to be visible'
          else
            @managers = User.where(role: UserType::MANAGER)
            render_wizard
          end
        else
          @site.form_step = 'managers'

          if @site.valid?
            redirect_to next_wizard_path
          else
            @managers = User.where(role: UserType::MANAGER)
            render_wizard
          end
        end


      when 'publishers'
        @site = current_site
        if save_button?
          if @site.save
            redirect_to admin_sites_path, notice: 'The site\'s main color might take a few minutes to be visible'
          else
            @publishers = User.where(role: UserType::PUBLISHER)
            render_wizard
          end
        else
          @site.form_step = 'publishers'

          if @site.valid?
            redirect_to next_wizard_path
          else
            @publishers = User.where(role: UserType::PUBLISHER)
            render_wizard
          end
        end


      when 'contexts'
        @site = current_site
        if save_button?
          if @site.save
            redirect_to admin_sites_path, notice: 'The site\'s main color might take a few minutes to be visible'
          else
            @contexts = Context.all
            render_wizard
          end
        else
          @site.form_step = 'contexts'

          if @site.valid?
            redirect_to next_wizard_path
          else
            @contexts = Context.all
            render_wizard
          end
        end

      when 'style'
        @site = current_site
        if save_button?
          if @site.save
            redirect_to admin_sites_path, notice: 'The site\'s main color might take a few minutes to be visible'
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
      when 'style_settings'
        settings = site_params.to_h
        @site = params[:site_slug] ? Site.find_by(slug: params[:site_slug]) : Site.new(session[:site][@site_id])

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
            @site.form_step = 'style_settings'
          end
        end

        if save_button?
          if @site.save
            redirect_to admin_sites_path, notice: 'The site\'s main color might take a few minutes to be visible'
          else
            render_wizard
          end
        else
          @site.form_step = 'style_settings'

          if @site.valid?
            redirect_to next_wizard_path
          else
            render_wizard
          end
        end

      when 'site_settings'
        settings = site_params.to_h
        @site = params[:site_slug] ? Site.find_by(slug: params[:site_slug]) : Site.new(session[:site][@site_id])

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
            @site.form_step = 'site_settings'
          end
        end

        if @site.save
          redirect_to next_wizard_path, notice: 'The site\'s main color might take a few minutes to be visible'
        else
          render_wizard
        end
    end
  end

  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def site_params
    params.require(:site).
      permit(
        :name,
        :site_template_id,
        :default_context,
        user_ids: [],
        context_sites_attributes: [:context_id, :id],
        routes_attributes: [:host, :id],
        site_settings_attributes: [
          :id, :position, :value, :name, :image,
          :attribution_link, :attribution_label,
          :translate_english, :translate_french,
          :translate_spanish, :pre_footer, :analytics_key, :keywords
        ]
      )
  end

  def current_site
    site = params[:site_slug] ? Site.find_by(slug: params[:site_slug]) : Site.new
    session[:site][@site_id] ||= {}
    session[:site][@site_id].delete(:site_template_id) if site.id

    # Contexts listing
    if !params[:site].blank? && site_params.to_h && step == 'contexts'
      if site_params[:context_sites_attributes]
        context_sites_attributes = {}
        site_params[:context_sites_attributes].values.each_with_index do |context, i|
          context['_destroy'] = true if context['context_id'].blank?
          context_sites_attributes["#{i}"] = context
        end
        session[:site][@site_id]['context_sites_attributes'] =  context_sites_attributes
      else
        session[:site][@site_id]['context_sites_attributes'] = []
      end
    end

    session[:site][@site_id].merge!(site_params.to_h.except(:default_context, 'context_sites_attributes')) if params[:site] && site_params.to_h

    # Default context
    if params[:site] && site_params.to_h && site_params[:default_context]
      default_context_id = params[:site].delete :default_context
      if session[:site][@site_id] && !session[:site][@site_id]['context_sites_attributes'].blank?
        default_context = session[:site][@site_id].dig('context_sites_attributes', "#{default_context_id}")
      end
      default_context['is_site_default_context'] = 'true' if default_context
    end



    site.assign_attributes session[:site][@site_id] if session[:site][@site_id]
    site
  end

  def save_button?
    params[:button].upcase == SAVE.upcase
  end

  def get_site_pages
    self.steps_names = *Site.form_steps[:names]
  end

  def set_site_id
    site = params[:site_slug] ? Site.find_by(slug: params[:site_slug]) : Site.new
    if site && site.persisted?
      @site_id = site.id
    else
      :new
    end
  end

  def ensure_session_keys_exist
    session[:site] ||= {}
  end
end
