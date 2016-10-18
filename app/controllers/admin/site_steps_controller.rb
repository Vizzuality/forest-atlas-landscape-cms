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
          @site.site_settings.new(name: 'color', value: '#000000', position: 3)
          session[:site] = @site.attributes
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

          # TODO: put this back! Solve the Backbone problem and put this back in
          # params['site']['routes_attributes'].each do |route|
          #  @site.routes.new host: route
          # end
          if @site.valid?
            session[:site] = @site.attributes
            redirect_to next_wizard_path
          else
            render_wizard
          end
        when 'users'
          session[:site] = session[:site].merge(site_params)

          @site = Site.new(session[:site])
          @site.form_step = 'users'

          #unless params['site'].blank? || params['site']['user_ids'].blank?
          #  params['site']['user_ids'].each do |user|
          #    @site.users << User.find(user)
          #  end
          #end

          if @site.valid?
            #session[:site] = @site.attributes
            #session[:site][:users_attributes] = @site.users

            redirect_to next_wizard_path
          else
            render_wizard
          end

        when 'style'
          session[:site] = session[:site].merge(site_params)
          @site = Site.new(session[:site])
          @site.form_step = 'style'
          #@site.site_settings = params[:site][:site_settings_attributes]

          #@site.assign_attributes(params)

          if @site.valid?
            #session[:site] = @site.attributes
            redirect_to next_wizard_path
          else
            render_wizard
          end

        when 'settings'
        when 'finish'

    end
  end



  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def site_params
    params.require(:site).
      permit(:name, :site_template_id,
             users_attributes: [:id],
             site_routes_attributes: [:id, :host, :path],
             site_settings_attributes: [:id, :position, :value, :name, :image])
  end


end
