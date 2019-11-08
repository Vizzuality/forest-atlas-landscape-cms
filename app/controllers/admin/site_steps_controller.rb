class Admin::SiteStepsController < AdminController
  require 'rake'

  include Wicked::Wizard
  include NavigationHelper
  include SiteStepsHelper

  URL_CONTROLLER_ID = 'site_routes_attributes'.freeze
  URL_CONTROLLER_NAME = 'site[routes_attributes]'.freeze
  COLOR_CONTROLLER_ID = 'site_site_settings_attributes_11'.freeze
  COLOR_CONTROLLER_NAME = 'site[site_settings_attributes][11]'.freeze

  SAVE = 'Save'.freeze
  CONTINUE = 'Continue'.freeze
  PREVIEW = 'Preview'.freeze

  steps *Site.form_steps[:pages]
  attr_accessor :steps_names
  helper_method :disable_button?
  helper_method :active_button?

  before_action :get_site_pages
  before_action :set_site_id, only: [:new, :edit, :update, :show]
  before_action :ensure_user_owns_site
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

    gon.site = current_site
    gon.users = non_admin_users;

    if step == 'name'
      @site = current_site
      gon.global.url_controller_id = URL_CONTROLLER_ID
      gon.global.url_controller_name = URL_CONTROLLER_NAME
      gon.global.url_array =
        @site.routes.order(main: :desc, id: :asc).to_a
    else
      @site = current_site
      if step == 'users'
        @site.build_user_site_associations_for_users(non_admin_users)
      end
      if step == 'contexts'
        @contexts = Context.all
      end
      if step == 'template'
        SiteSetting.create_color_settings @site
      end
      if step == 'content'
        SiteSetting.create_additional_settings @site

        @logo_image = @site.site_settings.where(name: 'logo_image').first
        @main_images = @site.site_settings.where(name: 'main_image')
                         .order(position: :asc)
        gon.global.main_images = @main_images.map { |x| x.attributes.merge!(image_url: x.image.url) }
        @alternative_image = @site.site_settings.where(name: 'alternative_image').first
        @favico = @site.site_settings.where(name: 'favico').first
      end
      if step == 'settings'
        SiteSetting.create_site_settings @site
        @default_site_language = @site.site_settings.where(name: 'default_site_language').first
        @translate_english = @site.site_settings.where(name: 'translate_english').first
        @translate_spanish = @site.site_settings.where(name: 'translate_spanish').first
        @translate_french = @site.site_settings.where(name: 'translate_french').first
        @translate_georgian = @site.site_settings.where(name: 'translate_georgian').first
        @transifex_api_key = @site.site_settings.where(name: 'transifex_api_key').first
      end
      if step == 'style'
        SiteSetting.create_style_settings @site
        gon.global.color_controller_id = COLOR_CONTROLLER_ID
        gon.global.color_controller_name = COLOR_CONTROLLER_NAME

        color_array = @site.site_settings.where(name: 'header-country-colours').first
        gon.global.color_array = color_array&.value&.split(' ')&.map { |x| {color: x} }
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
          # front-end doesn't tell us which routes were removed,
          # only passes a list of current ones
          @site.mark_routes_for_destruction(session[:site][@site_id]['routes_attributes'])
          if @site.save
            @site.routes.first.update(main: :true)
            delete_session_key(:site, @site_id)
            redirect_to admin_sites_path, notice: 'Changes to the template and styles might take a few minutes to be visible'
          else
            render_wizard
          end
        else
          @site.form_step = 'name'
          params['site']['routes_attributes']['0']['main'] = true if site_params['routes_attributes'] && site_params['routes_attributes']['0']
          session[:site][@site_id] = site_params.to_h

          if @site.valid?
            redirect_to next_wizard_path
          else
            render_wizard
          end
        end

      when 'users'
        @site = current_site
        if save_button?
          if @site.save
            delete_session_key(:site, @site_id)
            redirect_to admin_sites_path, notice: 'Changes to the template and styles might take a few minutes to be visible'
          else
            @site.build_user_site_associations_for_users(non_admin_users)
            render_wizard
          end
        else
          @site.form_step = 'users'

          if @site.valid?
            redirect_to next_wizard_path
          else
            @site.build_user_site_associations_for_users(non_admin_users)
            render_wizard
          end
        end

      when 'contexts'
        @site = current_site
        if save_button?
          if @site.save
            delete_session_key(:site, @site_id)
            redirect_to admin_sites_path, notice: 'Changes to the template and styles might take a few minutes to be visible'
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

      when 'settings'
        settings = site_params.to_h
        @site = current_site

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

        if save_button?
          if @site.save
            delete_session_key(:site, @site_id)
            redirect_to admin_sites_path, notice: 'Changes to the template and styles might take a few minutes to be visible'
          else
            render_wizard
          end
        else
          @site.form_step = 'settings'

          if @site.valid?
            redirect_to next_wizard_path
          else
            render_wizard
          end
        end

      when 'template'
        @site = current_site
        if save_button?
          if @site.save
            delete_session_key(:site, @site_id)
            redirect_to admin_sites_path, notice: 'Changes to the template and styles might take a few minutes to be visible'
          else
            render_wizard
          end
        else
          @site.form_step = 'template'

          if @site.valid?
            if @site.site_template.name == 'Default'
              redirect_to next_wizard_path
            else
              redirect_to wizard_path(:content)
            end
          else
            render_wizard
          end
        end

      when 'style'
        settings = site_params.to_h
        @site = current_site

        begin
          if @site.id
            # If the user is editing
            @site.site_settings.each do |site_setting|
              setting = settings[:site_settings_attributes].values.select { |s| s['id'] == site_setting.id.to_s }
              site_setting.assign_attributes setting.first.except('id', 'position', 'name') if setting.any?
            end
          else
            # If the user is creating a new site
            settings[:site_settings_attributes].map { |s| @site.site_settings.build(s[1]) }
            @site.form_step = 'settings'
          end
        end

        if save_button?
          if @site.save
            gon.global.color_array = []
            delete_session_key(:site, @site_id)
            redirect_to admin_sites_path, notice: 'Changes to the template and styles might take a few minutes to be visible'
          else
            render_wizard
          end
        else
          @site.form_step = 'style'

          if @site.valid?
            gon.global.color_array = []
            redirect_to next_wizard_path
          else
            render_wizard
          end
        end

      # In this step, the site is always saved
      when 'content'
        settings = site_params.to_h
        @site = current_site

        begin
          session[:site][@site_id]['site_settings_attributes'].values.map do |attrs|
            site_setting = nil
            if attrs['position'].present?
              site_setting = @site.site_settings.find do |ss|
                if ss.name == 'main_image'
                  if attrs['id'].present?
                    ss.id == attrs['id'].to_i
                  else
                    ss.position == attrs['position'].to_i
                  end
                else
                  ss.name == attrs['name']
                end
              end
            end

            if site_setting
              if attrs[:_destroy] == '1'
                site_setting.mark_for_destruction
              else
                site_setting.assign_attributes(attrs.except('_destroy'))
              end
            elsif attrs['_destroy'] != '1'
              @site.site_settings.build(attrs.except('_destroy'))
            end
          end
        end

        if save_button?
          if @site.save
            delete_session_key(:site, @site_id)
            redirect_to admin_sites_path, notice: 'Changes to the template and styles might take a few minutes to be visible'
          else
            render_wizard
          end
        else
          @site.form_step = 'content'

          if @site.save
            redirect_to next_wizard_path
          else
            render_wizard
          end
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
        user_site_associations_attributes: [:id, :user_id, :role, :selected],
        context_sites_attributes: [:context_id, :id],
        routes_attributes: [:host, :id, :main],
        site_settings_attributes: [
          :id, :position, :value, :name, :image,
          :attribution_link, :attribution_label,
          :default_site_language,
          :translate_english, :translate_french,
          :translate_spanish, :translate_georgian,
          :pre_footer, :analytics_key, :keywords, :contact_email_address,
          :transifex_api_key, :_destroy
        ]
      )
  end

  def current_site
    site = params[:site_slug] ? Site.find_by(slug: params[:site_slug]) : Site.new
    session[:site][@site_id] ||= {}
    #session[:site][@site_id].delete(:site_template_id) if site.id

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

    if params[:site].present? && site_params.to_h && step == 'users'
      if site_params[:user_site_associations_attributes]
        user_site_associations_attributes = {}
        site_params[:user_site_associations_attributes].to_h.each do |i, usa|
          usa['_destroy'] = true if usa['selected'] != '1'
          user_site_associations_attributes[i] = usa
        end
        session[:site][@site_id]['user_site_associations_attributes'] =  user_site_associations_attributes
      else
        session[:site][@site_id]['user_site_associations_attributes'] = {}
      end
    end

    # Add site_template_id to the session in case we continue without saving
    if !params[:site].blank? && site_params.to_h && step == 'template'
      session[:site][@site_id]['site_template_id'] = site_params[:site_template_id]
    end

    if params[:site] && site_params.to_h
      session[:site][@site_id].merge!(
        site_params.to_h.except(
          :default_context,
          'context_sites_attributes',
          'user_site_associations_attributes',
          'site_settings_attributes'
        )
      )

      # Merge site settings with the existing ones
      session[:site][@site_id]['site_settings_attributes'] ||= {}
      if site_params.to_h['site_settings_attributes']
        max_key = session[:site][@site_id]['site_settings_attributes'].keys.size
        site_params.to_h['site_settings_attributes'].values.each_with_index do |site_setting, index|
          existing_site_setting = session[:site][@site_id]['site_settings_attributes'].values.find do |ss|
            if ss['name'] == 'main_image'
              if ss['id'].present?
                ss['id'] == site_setting['id']
              else
                ss['position'] == site_setting['position']
              end
            else
              ss['name'] == site_setting['name']
            end
          end

          if existing_site_setting
            existing_site_setting.merge!(site_setting)
          else
            session[:site][@site_id]['site_settings_attributes'][max_key + index + 1] =
              site_setting
          end
        end

        process_site_settings
      end
    end

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

  def process_site_settings
    session[:site][@site_id]['site_settings_attributes'].values.each do |attrs|
      next unless attrs.key?('image')

      attrs['image'] = nil if attrs['_destroy'] == '1'

      url = attrs['image']
      next unless url.is_a?(String)

      unless url.include? 'temp_id='
        attrs.delete('image')
        next
      end

      id = url.gsub(/.*temp_id=/, '')
      image = TemporaryContentImage.find id
      attrs['image'] = image.image
    end
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
      @site_id = site.id.to_s
    else
      @site_id = :new
    end
  end

  def ensure_session_keys_exist
    session[:site] ||= {}
  end

  def non_admin_users
    User.where(admin: false).order(:name)
  end

  def ensure_user_owns_site
    site_id = Integer(@site_id) rescue nil
    return if user_site_admin?(site_id)
    flash[:alert] = 'You do not have permissions to view this page'
    redirect_to :no_permissions
  end
end
