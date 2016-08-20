Rails.application.routes.draw do
  mount Ckeditor::Engine => '/ckeditor'
  devise_for :users

  namespace :admin do
    resources :sites
    resources :users
    resources :routes
    resources :site_templates
    resources :page_templates
  end

  namespace :management do
    resources :site_pages
  end

  get '/admin', to: 'static#admin'
  get '/management', to: 'static#management'

  DynamicRouter.load
end
