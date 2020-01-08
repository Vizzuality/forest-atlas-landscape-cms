FactoryBot.define do
  factory :site do
    site_template { create :site_template_default }

    sequence(:name) { |n| "Site#{n}" }
    sequence(:slug) { |n| "site#{n}" }

    trait :with_name_info do
      before(:create) do |site|
        site.routes = build_list :route, 1, site: site
      end
    end

    trait :with_users_info do
      before(:create) do |site|
        site.user_site_associations =
          build_list :user_site_association, 1,
            selected: '1',
            role: '3',
            site: site
      end
    end

    trait :with_contexts_info do
      before(:create) do |site|
        site.context_sites = build_list :context_site, 1, site: site
      end
    end

    trait :with_settings_info do
      before(:create) do |site|
        site.site_settings = build_list :site_setting_hosting_organization,
          1,
          site: site
      end
    end

    trait :with_template_info do
    end

    trait :with_style_info do
      before(:create) do |site|
        site.site_settings = build_list :site_setting_color, 1, site: site
      end
    end

    factory :site_with_name, traits: [:with_name_info]
    factory :site_with_users, traits: [:with_name_info, :with_users_info]
    factory :site_with_contexts, traits: [
      :with_name_info,
      :with_users_info,
      :with_contexts_info
    ]
    factory :site_with_settings, traits: [
      :with_name_info,
      :with_users_info,
      :with_contexts_info,
      :with_settings_info
    ]
    factory :site_with_template, traits: [
      :with_name_info,
      :with_users_info,
      :with_contexts_info,
      :with_settings_info,
      :with_template_info
    ]
    factory :site_with_style, traits: [
      :with_name_info,
      :with_users_info,
      :with_contexts_info,
      :with_settings_info,
      :with_template_info,
      :with_style_info
    ]

    factory :site_with_routes do
      routes { build_list :route, 1 }
    end
  end
end
