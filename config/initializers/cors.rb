Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch('CORS_WHITELIST', '*').split(',')
    resource '/subscriptions',
             headers: :any,
             methods: [:get, :options, :head]
  end
end
