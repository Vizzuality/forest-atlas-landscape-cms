Rails.application.routes.draw do
  mount Ckeditor::Engine => '/ckeditor'
  devise_for :users

  namespace :admin do
    resources :sites, param: :slug do
      member do
        get :display
      end
      resources :site_steps, only: [:show, :update, :edit]
    end
    resources :site_steps, only: [:show, :update, :index, :new]
    resources :users
    resources :routes
    resources :site_templates
    resources :page_templates
    resources :site_settings
    resources :site_users
    resources :datasets, only: :index do
      get 'dataset'
    end
    get '/', to: 'static_page#dashboard'
    resources :contexts
  end

  namespace :management do
    resources :sites, param: :slug, only: [:index] do
      resources :site_pages, shallow: true do
        member do
          put :toggle_enable
        end
      end
      get '/structure', to: 'sites#structure'
    end
    get '/', to: 'static_page#dashboard'
  end
  get '/no-permissions', to: 'static_page#no_permissions'

   DynamicRouter.load
end
