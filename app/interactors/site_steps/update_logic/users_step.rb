module SiteSteps
  module UpdateLogic
    class UsersStep
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

        site.build_user_site_associations_for_users(non_admin_users)
        context.fail!
      end

      def continue_button_logic(site)
        site.form_step = 'users'

        return if site.valid?

        site.build_user_site_associations_for_users(non_admin_users)
        context.fail!
      end

      def non_admin_users
        User.where(admin: false).order(:name)
      end
    end
  end
end
