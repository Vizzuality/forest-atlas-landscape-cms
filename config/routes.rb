Rails.application.routes.draw do
  namespace :admin do
    resources :sites, param: :slug do
      resources :site_steps, only: [:show, :update, :edit]
    end
    resources :site_steps, only: [:show, :update, :new]
    resources :users
    resources :routes
    resources :site_templates
    resources :page_templates
    resources :site_users
    resources :datasets, only: :index do
      get 'dataset'
    end
    get '/', to: redirect('/admin/sites')
    resources :contexts
  end

  namespace :management do
    resources :sites, param: :slug, only: :none do
      resources :site_pages, only: [:index, :destroy] do
        member do
          put :toggle_enable
        end
        resources :page_steps, only: [:show, :update, :edit] do
          member do
            get :filtered_results,
                constraints: lambda { |req| req.format == :json }, defaults: {id: 'filters'}
          end
        end
      end
      resources :dataset_steps, only: [:index]
      resources :widget_steps, only: [:index]
      resources :page_steps, only: [:show, :update, :new] do
        member do
          get :filtered_results,
              constraints: lambda { |req| req.format == :json }, defaults: {id: 'filters'}
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
  get '/not_found', to: 'static_page#not_found'

  DynamicRouter.load
end
