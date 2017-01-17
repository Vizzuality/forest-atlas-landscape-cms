#lib/tasks/site/settings.rake
namespace :site do
  desc 'Creates or updates the site settings stylesheets'
  task :apply_settings, [:site_id] => :environment do |t, args|
    log = ActiveSupport::Logger.new('log/site_apply_settings.log')
    start_time = Time.now

    log.info "Task started at #{start_time}"
    log.info "Site: #{args[:site_id]}"

    begin
      site = Site.find(args[:site_id])
      puts ""
      puts ""
      puts "......................."
      puts "......................."
      puts "......................."
      puts "Site was: #{site.name}"
    rescue Exception => e
      log.error "#{e.inspect}"
    end



    end_time = Time.now
    duration = (end_time - start_time) / 1.minute
    log.info "Task finished at #{end_time} and last #{duration} minutes."
    log.close
  end
end
