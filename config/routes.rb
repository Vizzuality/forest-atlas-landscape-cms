Rails.application.routes.draw do
  namespace :admin do
    resources :sites, param: :slug do
      resources :site_steps, only: [:show, :update, :edit]
    end

    resources :site_steps, only: [:show, :update, :new]
    resources :users, only: [:index, :destroy] do
      resources :user_steps, only: [:edit, :show, :update]
    end

    resources :user_steps, only: [:new, :show, :update]
    resources :routes
    resources :site_templates
    resources :page_templates
    resources :site_users
    resources :datasets, only: :index do
      get 'dataset'
    end

    resources :contexts

    get '/', to: redirect('/admin/sites')
  end

  namespace :management do
    resources :profile, only: [:edit, :update]

    resources :sites, param: :slug, only: :none do
      resources :site_pages, only: [:index, :destroy] do
        member do
          put :toggle_enable
        end
        resources :page_steps, only: [:show, :update, :edit] do
          member do
            get :filtered_results,
                constraints: lambda { |req| req.format == :json }, defaults: {id: 'filters'}
            #get 'widget_data/:widget_id', to: 'page_steps#widget_data'
            get :widget_data,
                constraints: lambda { |req| req.format == :json }
          end
        end
      end

      resources :datasets, only: [:index, :destroy] do
        resources :dataset_steps, only: [:edit, :update, :show]
      end
      resources :dataset_steps, only: [:new, :update, :show]

      resources :widgets, only: [:index, :destroy] do
        resources :widget_steps, only: [:edit, :update, :show] do
          member do
            get :filtered_results,
                constraints: lambda { |req| req.format == :json }, defaults: {id: 'filters'}
          end
        end
      end

      resources :widget_steps, only: [:new, :update, :show] do
        member do
          get :filtered_results,
              constraints: lambda { |req| req.format == :json }, defaults: {id: 'filters'}
        end
      end

      resources :page_steps, only: [:show, :update, :new] do
        member do
          get :filtered_results,
              constraints: lambda { |req| req.format == :json }, defaults: {id: 'filters'}
          get :widget_data,
              constraints: lambda { |req| req.format == :json }
        end
      end
      get '/structure', to: 'sites#structure'
      put :update_structure

      resources :contexts, only: [:index, :destroy] do
        resources :context_steps, only: [:edit, :show, :update]
      end
    end
    get '/', to: 'static_page#dashboard'
  end

  resources :contexts, only: [:index, :destroy] do
    resources :context_steps, only: [:edit, :show, :update]
  end
  resources :context_steps, only: [:new, :show, :update]

  get '/no-permissions', to: 'static_page#no_permissions'
  get '/widget_data', to: 'static_page#widget_data'

  # Auth
  get 'auth/login', to: 'auth#login'
  get 'auth/logout', to: 'auth#logout'
  get '/not_found', to: 'static_page#not_found'

  DynamicRouter.load
end
