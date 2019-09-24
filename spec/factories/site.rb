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
        build :site_setting_hosting_organization, site: s
        build(:site_setting_contact_email_address, site: s)
        build(:site_setting_keywords, site: s)
        build(:site_setting_analytics_key, site: s)
        build(:site_setting_pre_footer, site: s)
        build(:transifex_api_key, site: s)
        build(:site_setting_default_site_language, site: s)
        build(:site_setting_georgian, site: s)
        build(:site_setting_english, site: s)
        build(:site_setting_french, site: s)
        build(:site_setting_spanish, site: s)
        build(:site_setting_color, site: s)
      end
    end


    # s.routes << FactoryBot.build(:site_setting_hosting_organization, site: s)
    # s.routes << FactoryBot.build(:site_setting_contact_email_address, site: s)
    # s.routes << FactoryBot.build(:site_setting_keywords, site: s)
    # s.routes << FactoryBot.build(:site_setting_analytics_key, site: s)
    # s.routes << FactoryBot.build(:site_setting_pre_footer, site: s)
    # s.routes << FactoryBot.build(:transifex_api_key, site: s)
    # s.routes << FactoryBot.build(:site_setting_default_site_language, site: s)
    # s.routes << FactoryBot.build(:site_setting_georgian, site: s)
    # s.routes << FactoryBot.build(:site_setting_english, site: s)
    # s.routes << FactoryBot.build(:site_setting_french, site: s)
    # s.routes << FactoryBot.build(:site_setting_spanish, site: s)
    # s.routes << FactoryBot.build(:site_setting_color, site: s)

    # trait :with_settings do
    #   # after(:create) do |s|
    #   #   create :site_setting_hosting_organization, site: s
    #   # end
    # end
  end
end
