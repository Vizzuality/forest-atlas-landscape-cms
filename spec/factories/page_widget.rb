FactoryBot.define do
  factory :page_widget do
    association :page

    widget_id { FactoryBot.build(:widget).id }
  end
end
