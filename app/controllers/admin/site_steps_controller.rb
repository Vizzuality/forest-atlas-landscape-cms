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
        if @site.site_settings.count < 1
          @site.site_settings.new(name: 'color', value: '#000000', position: 1)
        end
      end
      if step == 'settings'
        if @site.site_settings.length < 4
          @site.site_settings.new(name: 'logo_image', value: '', position: 2)
          @site.site_settings.new(name: 'logo_background', value: '#000000', position: 3)
          @site.site_settings.new(name: 'flag', value: '#000000', position: 4)
        end
      end
    end
    render_wizard
  end

  def update
      case step
        when 'name'
          @site = Site.new(site_params)
          @site.form_step = 'name'

          if @site.valid?
            session[:site] = @site.attributes
            redirect_to next_wizard_path
          else
            render_wizard
          end
        when 'users'
          session[:site] = session[:site].merge(site_params.to_h)

          @site = Site.new(session[:site].to_h)
          @site.form_step = 'users'

          if @site.valid?
            redirect_to next_wizard_path
          else
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
             site_routes_attributes: [:id, :host, :path],
             site_settings_attributes: [:id, :position, :value, :name, :image])
  end


end
