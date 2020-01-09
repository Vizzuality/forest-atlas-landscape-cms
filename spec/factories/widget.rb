#  :id, :user_id, :application, :slug, :name, :description,
#  :source, :source_url, :layer_id, :dataset, :authors, :query_url,
#  :widget_config, :metadata, :template, :default, :protected, :status,
#  :published, :freeze, :verified

FactoryBot.define do
  factory :widget do
    id { SecureRandom.uuid}
    application { 'forest-atlas' }
    sequence(:name) {|n| "name-#{n}"}
    sequence(:slug) {|n| "name-#{n}"}
    status { 'saved' }
  end
end
