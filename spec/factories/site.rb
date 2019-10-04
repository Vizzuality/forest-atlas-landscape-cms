FactoryBot.define do
  factory :site do
    association :site_template, factory: :site_template_fa

    sequence(:name) { |n| "Site#{n}" }
    sequence(:slug) { |n| "site#{n}"}

    factory :site_with_routes do
      routes { build_list :route, 1 }
    end

    trait :with_settings do
      after(:build) do |s|
        s.site_settings = [
          build(:site_setting_hosting_organization),
          build(:site_setting_contact_email_address),
          build(:site_setting_keywords),
          build(:site_setting_analytics_key),
          build(:site_setting_pre_footer),
          build(:transifex_api_key),
          build(:site_setting_default_site_language),
          build(:site_setting_georgian),
          build(:site_setting_english),
          build(:site_setting_french),
          build(:site_setting_spanish),
          build(:site_setting_color)
        ]
      end
    end
  end
end
