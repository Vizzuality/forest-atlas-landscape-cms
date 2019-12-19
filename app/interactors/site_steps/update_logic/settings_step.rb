module SiteSteps
  module UpdateLogic
    class SettingsStep
      include Interactor

      def call
        site = context.site
        settings_params = context.site_params.to_h

        process_site_settings(site, settings_params)

        if context.save_button
          # If the user pressed the save button
          save_button_logic(context.site)
        else
          continue_button_logic(context.site)
        end
      end

      def process_site_settings(site, settings_params)
        if site.id
          # If the user is editing
          site.site_settings.each do |site_setting|
            setting = settings_params[:site_settings_attributes].values.select do |s|
              s['id'] == site_setting.id.to_s
            end

            next unless setting.any?

            site_setting.assign_attributes(
              setting.first.except('id', 'position', 'name')
            )
          end
        else
          # If the user is creating a new site
          settings_params[:site_settings_attributes].each do |s|
            site.site_settings.build(s[1])
          end
          site.form_step = 'settings'
        end
      end

      def save_button_logic(site)
        return if site.save

        context.fail!
      end

      def continue_button_logic(site)
        site.form_step = 'settings'

        return if site.valid?

        context.fail!
      end
    end
  end
end
