# Be sure to restart your server when you modify this file.

Rails.application.config.session_store :active_record_store, key: '_forest-atlas-landscape-cms_session'
ActiveRecord::SessionStore::Session.serializer = :json
