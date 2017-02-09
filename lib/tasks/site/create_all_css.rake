#lib/tasks/site/create_all_css.rake
namespace :site do
  desc 'Creates the css for all sites'
  task :create_assets => :environment do
    log = ActiveSupport::Logger.new('log/site_apply_settings.log')
    start_time = Time.now

    log.info 'Going to create the css for all sites'

    begin
      Site.all.each do |site|
        log.info "Going to create css for site #{site.id}"
        site.compile_css
        log.info "Created css for site #{site.id}"
      end

      log.info 'Finished creating settings for all sites'
    rescue Exception => e
      log.error "#{e.inspect}"
    end

    end_time = Time.now
    duration = (end_time - start_time) / 1.minute
    log.info "Task Create All CSS finished at #{end_time} and last #{duration} minutes."
    log.close
  end
end
