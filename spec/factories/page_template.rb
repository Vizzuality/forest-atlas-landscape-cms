# == Schema Information
#
# Table name: pages
#
#  id                       :integer          not null, primary key
#  site_id                  :integer
#  name                     :string
#  description              :string
#  uri                      :string
#  url                      :string
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  content_type             :integer
#  type                     :text
#  enabled                  :boolean          default(FALSE)
#  parent_id                :integer
#  position                 :integer
#  content                  :json
#  show_on_menu             :boolean          default(TRUE)
#  page_version             :integer          default(1)
#  thumbnail_file_name      :string
#  thumbnail_content_type   :string
#  thumbnail_file_size      :integer
#  thumbnail_updated_at     :datetime
#  cover_image_file_name    :string
#  cover_image_content_type :string
#  cover_image_file_size    :integer
#  cover_image_updated_at   :datetime
#

FactoryBot.define do
  factory :page_template do
    association :site_template, factory: :site_template_fa

    show_on_menu { true }

    factory :page_template_homepage do
      name { 'Homepage' }
      description { 'Homepage description' }
      uri { '' }
      content_type { ContentType::HOMEPAGE }
      content { "[{\"id\":1532344156248,\"type\":\"text\",\"content\":\"<h1>The interactive forest atlas</h1>\"}]" }
    end

    factory :page_template_map do
      name { 'Map' }
      description { 'Explore the map' }
      uri { 'map' }
      content_type { ContentType::MAP }
      content { File.read(Dir.pwd + '/spec/support/fixtures/files/map.txt') }
    end

    factory :page_template_terms_of_service do
      name { 'Terms of Service' }
      description { 'Terms and privacy' }
      uri { 'terms-and-privacy' }
      content_type { ContentType::STATIC_CONTENT }
    end

    factory :page_template_privacy_policy do
      name { 'Privacy Policy' }
      description { 'Privacy Policy' }
      uri { 'privacy-policy' }
      content_type { ContentType::STATIC_CONTENT }
      show_on_menu { false }
    end
  end
end
