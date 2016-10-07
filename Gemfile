source 'https://rubygems.org'

gem 'rails', '>= 5.0.0', '< 5.1'
gem 'pg', '~> 0.18'
gem 'puma', '~> 3.0'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.1.0'

gem 'jquery-rails'
gem 'turbolinks', '~> 5.x'
gem 'jbuilder', '~> 2.0'

gem 'dotenv-rails', '~> 2.1'

gem 'devise'
gem 'ancestry'
gem 'bootstrap', '~> 4.0.0.alpha3'
gem 'ckeditor'
gem 'paperclip'
gem 'will_paginate', '~> 3.1.0'
gem 'active_model_serializers', '~> 0.10.0'
gem 'handlebars_assets'
gem 'enumerate_it'

gem 'faraday', '~> 0.9.2'

# Assets Pipeline
gem 'autoprefixer-rails'

source 'https://rails-assets.org' do
  gem 'rails-assets-d3', '~> 3.5.16'
  gem 'rails-assets-vega', '~> 2.5.2'
  gem 'rails-assets-leaflet', '0.7.7'
  gem 'rails-assets-backbone'
  gem 'rails-assets-jquery-ui'
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
end

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
