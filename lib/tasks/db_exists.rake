namespace :db do
  desc 'Check if db exists'
  task exists: :environment do
    begin
      ActiveRecord::Base.connection
    rescue
      Rake::Task['db:create'].invoke
      Rake::Task['db:migrate'].invoke
    else
      Rake::Task['db:migrate'].invoke
    end
  end
end
