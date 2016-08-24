namespace :db do
  desc 'Check if db exists'
  task exists: :environment do
    begin
      ActiveRecord::Base.connection
    rescue
      puts "No existe"
      Rake::Task['db:create'].invoke
      Rake::Task['db:migrate'].invoke
    else
      puts "existe"
      Rake::Task['db:migrate'].invoke
    end
  end
end
