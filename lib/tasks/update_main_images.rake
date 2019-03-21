namespace :db do
  namespace :main_images do

    desc 'Updates the position of the main_images'
    task :update => :environment do

      ActiveRecord::Base.transaction do
        begin
          SiteSetting.where("name = 'main_image' and position < 30").update_all(position: 60)

          puts 'Finished updating the position for the main images'
        rescue Exception => e
          Rails.logger.error "Error updating the site settings: #{e.inspect}"
          puts "Error updating the site settings: #{e.inspect}"
          raise ActiveRecord::Rollback
        end
      end
    end
  end
end
