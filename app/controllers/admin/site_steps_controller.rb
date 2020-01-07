class Admin::SiteStepsController < AdminController
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

  steps(*Site.form_steps[:pages])
  attr_accessor :steps_names
  helper_method :disable_button?
  helper_method :active_button?

  ## Callbacks
  prepend_before_action :ensure_session_keys_exist, only: [:new, :edit, :show, :update]
  before_action :site_pages
  before_action :set_site_id, only: [:new, :edit, :update, :show]
  before_action :ensure_user_owns_site
  after_action  :set_color_array, only: [:update]

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
    @site = current_site
    @breadcrumbs << {name: @site.id ? 'Editing "' + @site.name + '"' : 'New Site'}

    gon.site = @site
    gon.users = non_admin_users

    result = SiteSteps::ShowLogic.const_get("#{step.camelize}Step").call(
      gon: gon,
      site: @site
    )

    result.set_variables.each do |key, value|
      instance_variable_set("@#{key}", value)
    end

    render_wizard
  end

  def update
    @site = current_site
    result = SiteSteps::UpdateLogic.const_get("#{step.camelize}Step").call(
      save_button: save_button?,
      site: @site,
      site_id: @site_id,
      session: session,
      params: params,
      site_params: params[:site] ? site_params : {}
    )

    @site = result.site if result.success?

    if result.success? && (save_button? || step == 'content')
      render_success
    elsif result.success?
      render_continue
    else
      render_errors
    end
  end

  private

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
    result = SiteSteps::RecoverSite.call(
      step: step,
      params: params,
      site_params: params[:site].blank? ? {} : site_params,
      session: session,
      site_id: @site_id
    )

    site = result.site
    session[:site][@site_id] = result.session[:site][@site_id]
    site.assign_attributes session[:site][@site_id] if session[:site][@site_id]
    site
  end

  def save_button?
    params[:button].casecmp(SAVE).zero?
  end

  def site_pages
    self.steps_names = *Site.form_steps[:names]
  end

  def set_site_id
    site =
      params[:site_slug] ? Site.find_by(slug: params[:site_slug]) : Site.new

    @site_id = site&.persisted? ? site.id.to_s : :new
  end

  def ensure_session_keys_exist
    session[:site] ||= {}
  end

  def ensure_user_owns_site
    site_id = Integer(@site_id) rescue nil
    return if user_site_admin?(site_id)

    flash[:alert] = 'You do not have permissions to view this page'
    redirect_to :no_permissions
  end

  def set_color_array
    gon.global.color_array = [] if step == 'style'
  end

  def non_admin_users
    User.where(admin: false).order(:name)
  end

  def render_success
    delete_session_key(:site, @site_id)
    redirect_to admin_sites_path, notice:
      'Changes to the template and styles might take a few minutes '\
      'to be visible'
  end

  def render_continue
    @site.form_step = step
    if step != 'template' || @site.site_template.name == 'Default'
      redirect_to next_wizard_path
    else
      redirect_to wizard_path(:content)
    end
  end

  def render_errors
    @site.form_step = step
    render_wizard
  end
end
