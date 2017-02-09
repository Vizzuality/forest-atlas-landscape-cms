# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )

# Includes the folder for the temp css in the assets list
Rails.application.config.assets.paths << Rails.root.join('tmp', 'compiled_css')

Rails.application.config.assets.precompile += %w( management.js admin.js )
Rails.application.config.assets.precompile += %w( admin/application.css management/application.css front/application-theme-fa.css front/application-theme-lsa.css )
