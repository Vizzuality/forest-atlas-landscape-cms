# config valid only for current version of Capistrano
lock "3.7.0"

set :application, 'facms'
set :repo_url, 'git@github.com:Vizzuality/forest-atlas-landscape-cms.git'
set :deploy_user, 'ubuntu'
set :rvm_ruby_version, '2.3.1'
set :branch, 'capistrano_config'
set :keep_releases, 5
set :use_sudo, true

set :linked_files, %w{.env}
set :linked_dirs, %w{log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

set :deploy_to, '/var/www/facms'

namespace :deploy do
  after :finishing, 'deploy:cleanup'
  after 'deploy:publishing', 'deploy:restart'
end

