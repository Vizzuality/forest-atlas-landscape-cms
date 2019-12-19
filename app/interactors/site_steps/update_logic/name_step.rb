module SiteSteps
  module UpdateLogic
    class NameStep
      include Interactor

      def call
        if context.save_button
          # If the user pressed the save button
          save_button_logic(context.site_id, context.site, context.session)
        else
          continue_button_logic(context.site, context.params)
        end
      end

      def save_button_logic(site_id, site, session)
        # front-end doesn't tell us which routes were removed,
        # only passes a list of current ones
        site.mark_routes_for_destruction(
          session[:site][site_id]['routes_attributes']
        )
        if site.save
          site.routes.first.update(main: true)
        else
          context.fail!
        end
      end

      def continue_button_logic(site, params)
        site.form_step = 'name'
        if params.dig('site', 'routes_attributes', '0')
          params['site']['routes_attributes']['0']['main'] = true
        end

        return if site.valid?

        context.fail!
      end
    end
  end
end
