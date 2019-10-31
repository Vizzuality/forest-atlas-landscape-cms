FactoryBot.define do
  factory :tag do
    association :site_page

    sequence(:value) { |n| "tag-#{n}"}
  end
end
