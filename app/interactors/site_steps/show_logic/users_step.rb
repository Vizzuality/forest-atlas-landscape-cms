module SiteSteps
  module ShowLogic
    class UsersStep
      include Interactor

      def call
        context.site.build_user_site_associations_for_users(non_admin_users)

        context.set_variables = {}
      end

      def non_admin_users
        ::User.where(admin: false).order(:name)
      end
    end
  end
end
