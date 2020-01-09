FactoryBot.define do
  factory :user_site_association do
    association :user, factory: :user
    association :site, factory: :site

    role { '3' }
  end
end
