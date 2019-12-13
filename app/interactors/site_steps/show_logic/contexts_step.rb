module SiteSteps
  module ShowLogic
    class ContextsStep
      include Interactor

      def call
        context.set_variables = {
          contexts: ::Context.all
        }
      end
    end
  end
end
