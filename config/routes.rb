Rails.application.routes.draw do
  namespace :admin do
    resources :sites do
      member do
        get :display
      end
    end
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
      put :update_structure
    end
    get '/', to: 'static_page#dashboard'
  end
  get '/no-permissions', to: 'static_page#no_permissions'

  # Auth
  get 'auth/login', to: 'auth#login'
  post 'auth/logout', to: 'auth#logout'

   DynamicRouter.load
end
