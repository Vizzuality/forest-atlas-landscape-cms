FactoryBot.define do
  factory :context_user do
    association :context
    association :user

    role { 1 }
  end
end
