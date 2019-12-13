module SiteSteps
  module UpdateLogic
    class TemplateStep
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

        context.fail!
      end

      def continue_button_logic(site)
        site.form_step = 'template'

        return if site.valid?

        context.fail!
      end
    end
  end
end
