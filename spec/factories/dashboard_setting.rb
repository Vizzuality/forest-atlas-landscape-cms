FactoryBot.define do
  factory :dashboard_setting do
    association :site_page

    dataset_id { FactoryBot.build(:dataset).id }
    widget_id { FactoryBot.build(:widget).id }
    content_top {{ content: :top }}
    content_bottom {{ content: :bottom }}
  end
end
