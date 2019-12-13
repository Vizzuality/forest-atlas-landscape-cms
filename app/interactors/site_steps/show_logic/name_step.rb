module SiteSteps
  module ShowLogic
    class NameStep
      include Interactor

      def call
        gon = context.gon
        gon.global.url_controller_id =
          Admin::SiteStepsController::URL_CONTROLLER_ID
        gon.global.url_controller_name =
          Admin::SiteStepsController::URL_CONTROLLER_NAME
        gon.global.url_array =
          context.site.routes.order(main: :desc, id: :asc).to_a

        context.set_variables = {}
      end
    end
  end
end
