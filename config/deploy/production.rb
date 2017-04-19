server '34.207.36.87', user: 'ubuntu', roles: %w{web app db}, primary: true
set :ssh_options, {
  forward_agent: true
}
set :branch, 'master'
