module DatasetSteps
  module ShowLogic
    class ConnectorStep
      include Interactor

      def call
        gon = context.gon
        gon.collector_selected = nil
      end
    end
  end
end
