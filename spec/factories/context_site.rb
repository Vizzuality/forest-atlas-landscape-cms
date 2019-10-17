FactoryBot.define do
  factory :context_site do
    association :context
    association :site

    is_site_default_context { true }
  end
end
