source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

ruby '2.3.1'
gem 'rails', '>= 5.0.0', '< 5.1'

gem 'active_model_serializers', '~> 0.10.0'
gem 'activemodel-associations'
gem 'closure_tree'
gem 'dotenv-rails', '~> 2.1'
gem 'enumerate_it'
gem 'faraday', '~> 0.9.2'
gem 'faraday_middleware', '~> 0.11.0.1'
gem 'gon'
gem 'handlebars_assets'
gem 'jbuilder', '~> 2.0'
gem 'paperclip', '~> 5.2.0'
gem 'pg', '~> 0.18'
gem 'pg_search'
gem 'puma', '~> 3.0'
gem 'react-rails', '~> 2.4.4'
gem 'sendgrid-ruby'
gem 'webpacker', '~> 3.3.1'
gem 'wicked' # Multi-steps form
gem 'will_paginate', '~> 3.1.0'
gem 'sidekiq', '~> 5.2.0'
gem 'interactor', '~> 3.0'

# Session management
gem 'activerecord-session_store', github: 'rails/activerecord-session_store'

# Assets Pipeline
gem 'autoprefixer-rails'
gem 'coffee-rails', '~> 4.1.0'
gem 'jquery-rails'
gem 'sass-rails', '>= 5.0'
gem 'turbolinks', '~> 5.x'
gem 'uglifier', '>= 1.3.0'


# Gems with known vulnerabilities in older versions
gem 'ffi', '>= 1.9.24'
gem 'loofah', '>= 2.2.1'
gem 'rails-html-sanitizer', '>= 1.0.4'
gem 'sprockets', '>= 3.7.2'


source 'https://rails-assets.org' do
  gem 'rails-assets-backbone'
  gem 'rails-assets-esri-leaflet', '2.2.1'
  gem 'rails-assets-leaflet', '1.3.3'
  gem 'rails-assets-fuse.js'
  gem 'rails-assets-jquery-ui'
  gem 'rails-assets-select2', '4.0.3'
  gem 'rails-assets-summernote'
  gem 'rails-assets-bootstrap', '3.3.5'
end

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

group :development, :test do
  gem 'byebug', platform: :mri
  # %w[rspec-core rspec-expectations rspec-mocks rspec-rails rspec-support].each do |lib|
  #   gem lib, :git => "https://github.com/rspec/#{lib}.git", :branch => 'master'
  # end
  gem 'rspec-collection_matchers'
  gem 'rspec-rails', '~> 3.8'
  gem 'rspec-mocks', '~> 3.8'
  gem 'factory_bot_rails'
  gem 'test-prof'
end

group :development do
  gem 'annotate'
  gem 'listen', '~> 3.0.5'
  gem 'pry-rails'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'web-console'

  # Deploy
  gem 'capistrano', '3.7'
  gem 'capistrano-bundler'
  gem 'capistrano-passenger'
  gem 'capistrano-rails'
  gem 'capistrano-rvm'
  gem 'capistrano-sidekiq'
end

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

gem 'rack-cors'

gem 'simplecov', require: false, group: :test

gem 'database_cleaner-active_record', group: :test
