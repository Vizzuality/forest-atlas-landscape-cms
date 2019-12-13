module SiteSteps
  module UpdateLogic
    class ContextsStep
      include Interactor

      def call
        if context.save_button
          # If the user pressed the save button
          save_button_logic(context.site)
        else
          continue_button_logic(context.site)
        end
      end

      def save_button_logic(site)
        return if site.save

        context.contexts = ::Context.all
        context.fail!
      end

      def continue_button_logic(site)
        site.form_step = 'contexts'

        return if site.valid?

        context.contexts = ::Context.all
        context.fail!
      end
    end
  end
end
