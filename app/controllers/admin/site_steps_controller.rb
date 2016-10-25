class Admin::SiteStepsController < AdminController
  include Wicked::Wizard

  URL_CONTROLLER_ID = 'site_routes_attributes'.freeze
  URL_CONTROLLER_NAME = 'site[routes_attributes]'.freeze

  steps *Site.form_steps
  helper_method :disable_button?

  # This action cleans the session
  def new
    session[:site] = {}
    redirect_to admin_site_steps_path(id: :name)
  end

  # This action cleans the session
  def edit
    session[:site] = {}
    redirect_to admin_site_site_step_path(site_slug: params[:site_slug], id: :name)
  end

  def show
    if step == 'name'
      @site = current_site
      gon.urlControllerId = URL_CONTROLLER_ID
      gon.urlControllerName = URL_CONTROLLER_NAME
      gon.urlArray = @site.routes.to_a
    else
      @site = current_site
      #@site.attributes = session[:site]
      if step == 'style'
        SiteSetting.create_color_settings @site
      end
      if step == 'settings'
        SiteSetting.create_additional_settings @site
      end
    end
    render_wizard
  end

  def update
      case step
        when 'name'
          @site = current_site
          #@site.assign_attributes site_params

          # If the user pressed the save button
          if params[:commit] == 'SAVE CHANGES'
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
          #session[:site] = session[:site].merge(site_params.to_h)
          #@site = Site.new(session[:site])
          @site = current_site
          unless params[:site].blank?
            if params[:commit] == 'SAVE CHANGES'
              if site.save
                redirect_to admin_sites_path
              else
                render_wizard
              end
            else
              @site.form_step = 'users'

              if @site.valid?
                redirect_to next_wizard_path
              else
                render_wizard
              end
            end
          else
            @site = Site.new
            @site.errors.add(:users, 'Site must have at least one user')
            render_wizard
          end

        when 'style'
          #session[:site] = session[:site].merge(site_params.to_h)
          #@site = Site.new(session[:site])
          @site = current_site
          if params[:commit] == 'SAVE CHANGES'
            if site.save
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

        when 'settings'
          settings = site_params.to_h
          #@site = Site.new(session[:site])

          @site = params[:site_slug] ? Site.find_by(slug: params[:site_slug]) : Site.new(session[:site])
          #@site = current_site
          begin
            settings[:site_settings_attributes].map {|s| @site.site_settings.build(s[1]) }
          end
          @site.form_step = 'settings'

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
    #site.assign_attributes site_params if params[:site] && site_params
    session[:site].merge!(site_params.to_h) if params[:site] && site_params.to_h
    site.assign_attributes session[:site] if session[:site]
    site
  end

  # Checks if the navigation buttons should be enabled, according to the current step
  def disable_button? (current_step)
    # When is editing the site
    if @site.id
      return step == current_step
      # When is creating the site
    else
      return steps.find_index(step) <= steps.find_index(current_step)
    end
  end
end
