namespace :db do
  namespace :site_templates do

    desc 'Updates default pages of a newly created site'
    task :update => :environment do

      ActiveRecord::Base.transaction do
        begin
          Rails.logger.info '1. Finding the pages to be removed...'

          pages = PageTemplate.where('content_type not in (3, 4, 6)')
          pst = PageSiteTemplate.where(page_id: pages.map{|x| x.id})

          Rails.logger.info '1. Finished.'


          Rails.logger.info '2. Removing the pages\'s association...'

          pst.each do |page_template|
            PageSiteTemplate.connection.
              execute("delete from pages_site_templates where page_id = #{page_template.page_id}"\
               " and site_template_id = #{page_template.site_template_id}")
          end

          Rails.logger.info '2. Finished'


          Rails.logger.info '3. Removing the pages'

          pages.destroy_all

          Rails.logger.info '==== Finished updating the page templates'
        rescue Exception => e
          Rails.logger.error "Error updating the template pages: #{e.inspect}"
          raise ActiveRecord::Rollback
        end
      end
    end
  end
end
