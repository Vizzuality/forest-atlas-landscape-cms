#lib/tasks/site/apply_settings.rake
namespace :site do
  desc 'Creates or updates the site settings stylesheets'
  task :apply_settings, [:site_id] => :environment do |t, args|
    log = ActiveSupport::Logger.new('log/site_apply_settings.log')
    start_time = Time.now

    log.info "Task Apply Settings started at #{start_time} for site #{args[:site_id]}"

    begin
      site = Site.find(args[:site_id])

      site.compile_css

      log.info "Finished applying settings for site #{site.id}"
    rescue Exception => e
      log.error "#{e.inspect}"
    end

    end_time = Time.now
    duration = (end_time - start_time) / 1.minute
    log.info "Task Apply Settings finished at #{end_time} and last #{duration} minutes."
    log.close
  end
end
