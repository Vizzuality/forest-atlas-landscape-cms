FactoryBot.define do
  factory :context do
    # association :sites, factory: :site_with_routes

    sequence(:name) { |n| "Test #{('AA'..'ZZ').to_a[n]}" }
    sites { [FactoryBot.create(:site_with_routes)] }
  end
end
