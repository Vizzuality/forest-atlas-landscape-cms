source 'https://rubygems.org'

ruby '2.3.1'
gem 'rails', '>= 5.0.0', '< 5.1'
gem 'pg', '~> 0.18'
gem 'puma', '~> 3.0'
gem 'sass-rails', '>= 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.1.0' # REMOVE ME

gem 'jquery-rails' # REMOVE ME
gem 'turbolinks', '~> 5.x'
gem 'jbuilder', '~> 2.0'
gem 'rails-assets-fitvids', '~> 1.2.0'

gem 'dotenv-rails', '~> 2.1'

gem 'closure_tree'
gem 'paperclip', '~> 5.0.0'
gem 'will_paginate', '~> 3.1.0'
gem 'active_model_serializers', '~> 0.10.0'
gem 'activemodel-associations'
gem 'handlebars_assets'
gem 'enumerate_it'
gem 'gon'
gem 'wicked' # Multi-steps form

gem 'faraday', '~> 0.9.2'
gem 'faraday_middleware', '~> 0.11.0.1'

gem 'webpacker', '~> 3.3.1'
gem 'react-rails', '~> 2.4.4'

# Session management
gem 'activerecord-session_store', github: 'rails/activerecord-session_store'

# Assets Pipeline
gem 'autoprefixer-rails'

source 'https://rails-assets.org' do
  gem 'rails-assets-d3', '~> 3.5.16'
  gem 'rails-assets-vega', '~> 2.6.3'
  gem 'rails-assets-leaflet', '1.3.3'
  gem 'rails-assets-esri-leaflet', '2.2.1'
  gem 'rails-assets-backbone'
  gem 'rails-assets-jquery-ui'
  gem 'rails-assets-fuse.js'
  gem 'rails-assets-datalib', '1.7.3'
  gem 'rails-assets-SINTEF-9012--PruneCluster', '1.1.0'
  gem 'rails-assets-select2', '4.0.3'
end

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

group :development, :test do
  gem 'byebug', platform: :mri
  %w[rspec-core rspec-expectations rspec-mocks rspec-rails rspec-support].each do |lib|
    gem lib, :git => "https://github.com/rspec/#{lib}.git", :branch => 'master'
  end
end

group :development do
  gem 'annotate'
  gem 'web-console'
  gem 'listen', '~> 3.0.5'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'pry-rails'

  # Deploy
  gem 'capistrano', '3.7'
  gem 'capistrano-rails'
  gem 'capistrano-bundler'
  gem 'capistrano-rvm'
  gem 'capistrano-passenger'
end

gem 'appsignal'
gem 'newrelic_rpm'

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
