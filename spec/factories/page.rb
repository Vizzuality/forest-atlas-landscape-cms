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
  factory :page do

    sequence(:name) { |n| "Page#{n}" }
    sequence(:description) { |n| "desc#{n}"}
    sequence(:uri) { |n| "page-#{n}"}
    content_type { ContentType::OPEN_CONTENT_V2 }
    type { "SitePage" }
    enabled { true }
    position { 1 }
    content { "[{\"id\":1566471331601,\"type\":\"text\",\"content\":\"\\\"<p>Demo page.</p>\\\"\"}]" }

    trait :with_tags do

    end
  end
end
