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
            puts "... Updating settings for site #{site.name}"

            unless site.site_settings.exists?(name: 'logo_image')
              logo_setting = SiteSetting.new(name: 'logo_image', value: '', position: 2)
              site.site_settings << logo_setting
              logo_setting.save!(validate: false)
              puts '...... Added logo_image'
            end
            unless site.site_settings.exists?(name: 'favico')
              site.site_settings.create!(name: 'favico', value: '', position: 3)
              puts '...... Added favico'
            end
            unless site.site_settings.exists?(name: 'flag') or site.site_template.name != 'Forest Atlas'
              site.site_settings.create!(name: 'flag', value: '', position: 4)
              puts '...... Added flag'
            end
            unless site.site_settings.exists?(name: 'main_image')
              site.site_settings.create!(name: 'main_image', value: '', position: 5)
              puts '...... Added main_image'
            end
            unless site.site_settings.exists?(name: 'alternative_image')
              site.site_settings.create!(name: 'alternative_image', value: '', position: 6)
              puts '...... Added alternative_image'
            end
            unless site.site_settings.exists?(name: 'translate_english')
              site.site_settings.create!(name: 'translate_english', value: true, position: 7)
              puts '...... Added translate_english'
            end
            unless site.site_settings.exists?(name: 'translate_spanish')
              site.site_settings.create!(name: 'translate_spanish', value: true, position: 8)
              puts '...... Added translate_spanish'
            end
            unless site.site_settings.exists?(name: 'translate_french')
              site.site_settings.create!(name: 'translate_french', value: true, position: 9)
              puts '...... Added translate_french'
            end
            unless site.site_settings.exists?(name: 'translate_georgian')
              site.site_settings.create!(name: 'translate_georgian', value: true, position: 16)
              puts '...... Added translate_georgian'
            end
            unless site.site_settings.exists?(name: 'pre_footer')
              site.site_settings.create!(name: 'pre_footer', value: '', position: 10)
              puts '...... Added pre_footer'
            end
            unless site.site_settings.exists?(name: 'analytics_key')
              site.site_settings.create!(name: 'analytics_key', value: '', position: 11)
              puts '...... Added analytics_key'
            end
            unless site.site_settings.exists?(name: 'keywords')
              site.site_settings.create!(name: 'keywords', value: '', position: 12)
              puts '...... Added keywords'
            end
            unless site.site_settings.exists?(name: 'contact_email_address')
              site.site_settings.create!(name: 'contact_email_address', value: '', position: 13)
              puts '...... Added contact_email_address'
            end
            unless site.site_settings.exists?(name: 'hosting_organization')
              site.site_settings.create!(name: 'hosting_organization', value: '', position: 14)
              puts '...... Added hosting_organization'
            end
            unless site.site_settings.exists?(name: 'default_site_language')
              site.site_settings.create!(name: 'default_site_language', value: 'en', position: 15)
              puts '...... Added default_site_language'
            end
            puts "... Finished creation for site #{site.name}"
            puts ''
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
