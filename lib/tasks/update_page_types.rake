namespace :old_pages do
  desc "Removes page types that don't exist anymore"
  task :delete => :environment do
    SitePage.where.not(content_type: ContentType.list).destroy_all
  end
end
