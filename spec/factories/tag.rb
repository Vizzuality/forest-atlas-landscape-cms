FactoryBot.define do
  factory :tag do
    association :page

    sequence(:value) { |n| "tag-#{n}"}
  end
end
