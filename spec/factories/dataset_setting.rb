#  id                   :integer          not null, primary key
#  site_page_id         :integer
#  context_id           :integer
#  dataset_id           :string           not null
#  filters              :json
#  columns_visible      :json
#  columns_changeable   :json
#  api_table_name       :string
#  fields_last_modified :string
#  legend               :json
#  widgets              :json

FactoryBot.define do
  factory :dataset_setting do
    association :site_page

    dataset_id { FactoryBot.build(:dataset).id }
    filters { }
    columns_visible { }
    columns_changeable { }
    api_table_name { 'test' }
    legend { }
    widgets { }
  end
end
