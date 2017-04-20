# config valid only for current version of Capistrano
lock "3.7.0"

set :application, 'facms'
set :repo_url, 'git@github.com:Vizzuality/forest-atlas-landscape-cms.git'
set :deploy_user, 'ubuntu'
set :rvm_ruby_version, '2.3.1'
set :keep_releases, 5
set :use_sudo, true

set :linked_files, %w{.env}
set :linked_dirs, %w{log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system public/sitemaps}

set :deploy_to, '/var/www/facms'

require "whenever/capistrano"
require 'capistrano/sitemap_generator'

before 'deploy:publishing', 'site_settings:update'
before "deploy:publishing", "assets:precompile_sites"
after 'deploy:publishing', 'sitemap:refresh'

namespace :deploy do
  after :finishing, 'deploy:cleanup'
  after 'deploy:publishing', 'deploy:restart'

  namespace :assets do
    task :precompile_sites do
      on roles(fetch(:assets_roles)) do
        within release_path do
          with rails_env: fetch(:rails_env) do
            execute(:rake, "site:create_assets")
          end
        end
      end
    end
  end

  namespace :site_settings do
    task :update do
      on roles(fetch(:assets_roles)) do
        within release_path do
          with rails_env: fetch(:rails_env) do
            execute(:rake, 'db:site_settings:update')
          end
        end
      end
    end
  end
end

