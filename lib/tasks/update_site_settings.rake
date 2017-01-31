namespace :db do
  namespace :site_settings do

    desc 'Updates the position of the site settings'
    task :update => :environment do

      ActiveRecord::Base.transaction do
        begin
          SiteSetting.delete_all(name: 'logo_background')
          puts 'Deleted all the logo background colors'

          SiteSetting.where(name: 'flag').update_all(position: 6)

          Site.all.each do |site|
            unless site.site_settings.exists?(name: 'main_image')
              site.site_settings.create!(name: 'main_image', value: '', position: 3)
            end
            unless site.site_settings.exists?(name: 'alternative_image')
              site.site_settings.create!(name: 'alternative_image', value: '', position: 4)
            end
            unless site.site_settings.exists?(name: 'favico')
              site.site_settings.create!(name: 'favico', value: '', position: 5)
            end
            puts "... finished creation for site #{site.name}"
          end
          puts 'Finished updating the position for the site settings'
        rescue Exception => e
          Rails.logger.error "Error updating the site settings: #{e.inspect}"
          puts "E: #{e.inspect}"
          raise ActiveRecord::Rollback
        end
      end
    end
  end
end
