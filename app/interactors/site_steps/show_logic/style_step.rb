module SiteSteps
  module ShowLogic
    class StyleStep
      include Interactor

      def call
        site = context.site
        SiteSetting.create_style_settings site

        gon = context.gon
        gon.global.color_controller_id = Admin::SiteStepsController::COLOR_CONTROLLER_ID
        gon.global.color_controller_name = Admin::SiteStepsController::COLOR_CONTROLLER_NAME

        color_array = site.site_settings.where(name: 'header-country-colours').first
        gon.global.color_array = color_array&.value&.split(' ')&.map { |x| {color: x} }

        context.set_variables = {}
      end
    end
  end
end
