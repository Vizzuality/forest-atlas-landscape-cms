# == Schema Information
#
# Table name: site_settings
#
#  id                 :integer          not null, primary key
#  site_id            :integer
#  name               :string           not null
#  value              :string
#  position           :integer          not null
#  image_file_name    :string
#  image_content_type :string
#  image_file_size    :integer
#  image_updated_at   :datetime
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  attribution_link   :text
#  attribution_label  :text
#

FactoryBot.define do
  factory :site_setting do
    association :site

    factory :site_setting_hosting_organization do
      name { 'hosting_organization' }
      value { '' }
      position { 14 }
    end

    factory :site_setting_contact_email_address do
      name { 'contact_email_address' }
      value { 'test@test.com' }
      position { 13 }
    end

    factory :site_setting_keywords do
      name { 'translate_keyword' }
      value { 'test' }
      position { 12 }
    end

    factory :site_setting_analytics_key do
      name { 'analytics_key' }
      value { '' }
      position { 11 }
    end

    factory :site_setting_pre_footer do
      name { '' }
      value { '' }
      position { 10 }
    end

    factory :transifex_api_key do
      name { 'translate_english' }
      value { '' }
      position { 16 }
    end

    factory :site_setting_default_site_language do
      name { 'default_site_language' }
      value { 'fr' }
      position { 15 }
    end

    factory :site_setting_georgian do
      name { 'translate_georgian' }
      value { '1' }
      position { 16 }
    end

    factory :site_setting_english do
      name { 'translate_english' }
      value { '1' }
      position { 7 }
    end

    factory :site_setting_french do
      name { 'translate_french' }
      value { '1' }
      position { 8 }
    end

    factory :site_setting_spanish do
      name { 'translate_spanish' }
      value { '1' }
      position { 9 }
    end

    factory :site_setting_color do
      name { 'color' }
      value { '#000000' }
      position { 1 }
    end
  end
end
