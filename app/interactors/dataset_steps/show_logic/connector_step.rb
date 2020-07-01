module DatasetSteps
  module ShowLogic
    class ConnectorStep
      include Interactor

      def call
        dataset = context.dataset

        gon = context.gon
        gon.global.connector_selected = {
          connector: dataset.provider,
          connector_url: dataset.connector_url,
          provider: dataset.provider,
          type: dataset.type
        }

        context.set_variables = {}
      end
    end
  end
end
