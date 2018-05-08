server '52.45.163.131', user: 'ubuntu', roles: %w{web app db}, primary: true
set :ssh_options, {
  forward_agent: true
}
set :branch, 'develop'
