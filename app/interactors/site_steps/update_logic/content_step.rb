module SiteSteps
  module UpdateLogic
    class ContentStep
      include Interactor

      def call
        process_site_settings(
          context.site_id,
          context.site,
          context.session
        )

        return if context.site.save

        context.fail!
      end

      def process_site_settings(site_id, site, session)
        session[:site][site_id]['site_settings_attributes'].values.each do |attrs|
          site_setting = nil
          if attrs['position'].present?
            site_setting = site.site_settings.find do |ss|
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
            site.site_settings.build(attrs.except('_destroy'))
          end
        end
      end
    end
  end
end
