module DatasetSteps
  module ShowLogic
    class ContextStep
      include Interactor

      def call
        context.set_variables = {
          user_contexts: context.site.contexts,
          dataset_context: context.dataset.id || []
        }
      end
    end
  end
end
