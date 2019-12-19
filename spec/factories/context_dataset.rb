FactoryBot.define do
  factory :context_dataset do
    association :context

    dataset_id { FactoryBot.build(:dataset).id }
    is_confirmed { true }
    is_dataset_default_context { true }
  end
end
