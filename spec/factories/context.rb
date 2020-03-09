FactoryBot.define do
  factory :context do
    #association :sites, factory: :site_with_routes

    sequence(:name) { |n| "Test #{('AA'..'ZZ').to_a[n]}" }
    sites { [Site.first || FactoryBot.create(:site_with_routes)] }
  end
end
