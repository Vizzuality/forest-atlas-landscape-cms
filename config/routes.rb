Rails.application.routes.draw do
  devise_for :users, path: 'admin'

  namespace :admin do
    resources :sites
    resources :users
    resources :site_templates
  end

  get '/admin', to: 'static#admin'

  DynamicRouter.load
end
