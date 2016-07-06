Rails.application.routes.draw do
  mount Ckeditor::Engine => '/ckeditor'
  devise_for :users

  namespace :admin do
    resources :sites
    resources :users
    resources :routes
    resources :site_templates
  end

  namespace :management do
    resources :pages
  end

  get '/admin', to: 'static#admin'
  get '/management', to: 'static#management'

  DynamicRouter.load
end
