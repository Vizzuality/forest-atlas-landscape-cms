# The user role 2 (Manager) does not exist anymore
# All managers become site admins (role 1)

namespace :user_site do
  desc 'Updates the site managers to site admins'
  task update_managers: :environment do

    ActiveRecord::Base.transaction do
      begin
        UserSiteAssociation.where(role: 2).update_all(role: 1)
      end
    end
  end
end
