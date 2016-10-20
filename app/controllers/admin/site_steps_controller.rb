class Admin::SiteStepsController < AdminController
  include Wicked::Wizard

  URL_CONTROLLER_ID = 'site_routes_attributes'.freeze
  URL_CONTROLLER_NAME = 'site[routes_attributes]'.freeze

  steps *Site.form_steps


  def show
    if step == 'name'
      @site = Site.new
      gon.urlControllerId = URL_CONTROLLER_ID
      gon.urlControllerName = URL_CONTROLLER_NAME
      gon.urlArray = @site.routes
    else
      @site = Site.new(session[:site])
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
          @site = Site.new(site_params)
          session[:site] = site_params.to_h
          @site.form_step = 'name'

          if @site.valid?
            redirect_to next_wizard_path
          else
            render_wizard
          end

        when 'users'
          unless params[:site].blank?
            session[:site] = session[:site].merge(site_params.to_h)
            @site = Site.new(session[:site])
            @site.form_step = 'users'

            if @site.valid?
              redirect_to next_wizard_path
            else
              render_wizard
            end
          else
            @site = Site.new
            @site.errors.add(:users, 'Site must have at least one user')
            render_wizard
          end


        when 'style'
          session[:site] = session[:site].merge(site_params.to_h)
          @site = Site.new(session[:site])
          @site.form_step = 'style'

          if @site.valid?
            redirect_to next_wizard_path
          else
            render_wizard
          end

        when 'settings'
          settings = site_params.to_h
          @site = Site.new(session[:site])
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
             #site_routes_attributes: [:id, :host, :path],
             site_settings_attributes: [:id, :position, :value, :name, :image])
  end
end
