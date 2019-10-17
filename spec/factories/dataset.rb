#  :id, :application, :name, :metadata, :data_path, :attributes_path,
#  :provider, :format, :layers, :connector_url, :table_name, :tags,
#  :data_overwrite, :connector, :provider, :type, :legend, :status
FactoryBot.define do
  factory :dataset do
    id { SecureRandom.uuid}
    application { 'forest-atlas' }
    sequence(:name) {|n| "name-#{n}"}
    provider { 'cartodb' }
    status { 'saved' }

  end
end
