module SiteSteps
  module ShowLogic
    class TemplateStep
      include Interactor

      def call
        SiteSetting.create_color_settings context.site

        context.set_variables = {}
      end
    end
  end
end
