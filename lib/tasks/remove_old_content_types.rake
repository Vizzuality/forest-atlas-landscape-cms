namespace :db do
  namespace :pages do
    desc 'Remove pages with old content types'
    task content_type: :environment do
      begin
        ActiveRecord::Base.transaction do
          Page.where.not(content_type: ContentType.list).destroy_all
        end
      rescue StandardError => e
        Rails.logger.error "Error updating pages: #{e.inspect}"
        puts "Error updating pages: #{e.inspect}"
        raise ActiveRecord::Rollback
      end
    end
  end
end
