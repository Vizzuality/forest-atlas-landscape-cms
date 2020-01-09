module SiteSteps
  class RecoverSite
    include Interactor

    def call
      result = current_site(
        context.step,
        context.site_id,
        context.session,
        context.params,
        context.site_params
      )

      context.site = result[:site]
      context.session = result[:session]
    end

    def current_site(step, site_id, session, params, site_params)
      site =
        params[:site_slug] ? Site.find_by(slug: params[:site_slug]) : Site.new
      session[:site][site_id] ||= {}

      # Add site_template_id to the session in case we continue without saving
      set_site_template_id(step, site_id, session, params, site_params)

      # Contexts listing
      set_context_sites_attributes(step, site_id, session, params, site_params)

      # User site associations
      set_user_site_associations_attributes(
        step, site_id, session, params, site_params
      )

      # Site settings attributes
      if params[:site] && site_params.to_h
        session[:site][site_id].merge!(
          site_params.to_h.except(
            :default_context,
            'context_sites_attributes',
            'user_site_associations_attributes',
            'site_settings_attributes'
          )
        )

        set_site_settings_attributes(site_id, session, site_params)
      end

      {site: site, session: session}
    end

    def set_site_template_id(step, site_id, session, params, site_params)
      return if params[:site].blank? || !site_params.to_h || step != 'template'

      session[:site][site_id]['site_template_id'] =
        site_params[:site_template_id]
    end

    def set_context_sites_attributes(step, site_id, session, params, site_params)
      return if step != 'contexts' || params[:site].blank?

      if site_params[:context_sites_attributes]
        context_sites_attributes = {}
        site_params[:context_sites_attributes].values.each_with_index do |context, i|
          context['_destroy'] = true if context['context_id'].blank?
          context_sites_attributes[i.to_s] = context
        end
        session[:site][site_id]['context_sites_attributes'] =
          context_sites_attributes
      else
        session[:site][site_id]['context_sites_attributes'] = []
      end

      # Default context
      return unless site_params[:default_context]

      set_default_context(site_id, session, params)
    end

    def set_default_context(site_id, session, params)
      default_context_id = params[:site].delete :default_context
      unless session.to_hash.dig(:site, site_id, 'context_sites_attributes').blank?
        default_context =
          session[:site][site_id]['context_sites_attributes'][default_context_id.to_s]
      end
      default_context['is_site_default_context'] = 'true' if default_context
    end

    def set_user_site_associations_attributes(step, site_id, session, params, site_params)
      return if step != 'users' || params[:site].blank?

      if site_params[:user_site_associations_attributes]
        user_site_associations_attributes = {}
        site_params[:user_site_associations_attributes].to_h.each do |i, usa|
          usa['_destroy'] = true if usa['selected'] != '1'
          user_site_associations_attributes[i] = usa
        end
        session[:site][site_id]['user_site_associations_attributes'] =
          user_site_associations_attributes
      else
        session[:site][site_id]['user_site_associations_attributes'] = {}
      end
    end

    def set_site_settings_attributes(site_id, session, site_params)
      session[:site][site_id]['site_settings_attributes'] ||= {}
      return if site_params.to_h['site_settings_attributes'].blank?

      site_setting_attributes = session[:site][site_id]['site_settings_attributes']

      max_key = site_setting_attributes.keys.size
      site_params.to_h['site_settings_attributes'].values.each_with_index do |site_setting, index|
        existing_site_setting = site_setting_attributes.values.find do |ss|
          site_setting_comparison(ss, site_setting)
        end

        if existing_site_setting
          existing_site_setting.merge!(site_setting)
        else
          site_setting_attributes[max_key + index + 1] = site_setting
        end
      end

      process_site_settings_with_images(site_id, session)
    end

    def site_setting_comparison(session_site_setting, params_site_setting)
      if session_site_setting['name'] == 'main_image'
        if session_site_setting['id'].present?
          session_site_setting['id'] == params_site_setting['id']
        else
          session_site_setting['position'] == params_site_setting['position']
        end
      else
        session_site_setting['name'] == params_site_setting['name']
      end
    end

    def process_site_settings_with_images(site_id, session)
      session[:site][site_id]['site_settings_attributes'].values.each do |attrs|
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
  end
end
