namespace :db do
  namespace :site_settings do

    desc 'Updates the position of the site settings'
    task :update => :environment do

      ActiveRecord::Base.transaction do
        begin
          SiteSetting.delete_all(name: 'logo_background')
          puts 'Deleted all the logo background colors'

          SiteSetting.where(name: 'favico').update_all(position: 3)
          SiteSetting.where(name: 'flag').update_all(position: 4)
          SiteSetting.where(name: 'main_image').update_all(position: 5)
          SiteSetting.where(name: 'alternative_image').update_all(position: 6)

          Site.all.each do |site|
            unless site.site_settings.exists?(name: 'logo_image')
              site.site_settings.create!(name: 'logo_image', value: '', position: 2)
            end
            unless site.site_settings.exists?(name: 'favico')
              site.site_settings.create!(name: 'favico', value: '', position: 3)
            end
            unless site.site_settings.exists?(name: 'main_image')
              site.site_settings.create!(name: 'main_image', value: '', position: 5)
            end
            unless site.site_settings.exists?(name: 'alternative_image')
              site.site_settings.create!(name: 'alternative_image', value: '', position: 6)
            end
            unless site.site_settings.exists?(name: 'translate_english')
              site.site_settings.create!(name: 'translate_english', value: true, position: 7)
            end
            unless site.site_settings.exists?(name: 'translate_spanish')
              site.site_settings.create!(name: 'translate_spanish', value: true, position: 8)
            end
            unless site.site_settings.exists?(name: 'translate_french')
              site.site_settings.create!(name: 'translate_french', value: true, position: 9)
            end
            unless site.site_settings.exists?(name: 'pre_footer')
              site.site_settings.create!(name: 'pre_footer', value: '', position: 10)
            end
            unless site.site_settings.exists?(name: 'analytics_key')
              site.site_settings.create!(name: 'analytics_key', value: '', position: 11)
            end
            unless site.site_settings.exists?(name: 'keywords')
              site.site_settings.create!(name: 'keywords', value: '', position: 12)
            end
            puts "... finished creation for site #{site.name}"
          end
          puts 'Finished updating the position for the site settings'
        rescue Exception => e
          Rails.logger.error "Error updating the site settings: #{e.inspect}"
          puts "Error updating the site settings: #{e.inspect}"
          raise ActiveRecord::Rollback
        end
      end
    end
  end
end
