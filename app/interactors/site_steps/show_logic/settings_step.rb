module SiteSteps
  module ShowLogic
    class SettingsStep
      include Interactor

      def call
        site = context.site
        SiteSetting.create_site_settings site

        context.set_variables = {
          default_site_language:
            site.site_settings.find { |ss| ss.name == 'default_site_language' },
          translate_english:
            site.site_settings.find { |ss| ss.name == 'translate_english' },
          translate_spanish:
            site.site_settings.find { |ss| ss.name == 'translate_spanish' },
          translate_french:
            site.site_settings.find { |ss| ss.name == 'translate_french' },
          translate_georgian:
            site.site_settings.find { |ss| ss.name == 'translate_georgian' },
          transifex_api_key:
            site.site_settings.find { |ss| ss.name == 'transifex_api_key' }
        }
      end
    end
  end
end
