Rails.application.routes.draw do
  mount Ckeditor::Engine => '/ckeditor'
  devise_for :users

  namespace :admin do
    resources :sites
    resources :users
    resources :routes
    resources :site_templates
    resources :page_templates
    get '/', to: 'static_page#dashboard'
  end

  namespace :management do
    resources :site_pages
    resources :sites, only: [:index]
    get '/', to: 'static_page#dashboard'
  end
  get '/no-permissions', to: 'static_page#no_permissions'

  DynamicRouter.load
end
