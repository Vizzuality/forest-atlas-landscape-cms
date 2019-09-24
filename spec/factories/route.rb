FactoryBot.define do
  factory :route do
    association :site

    host { 'http://localhost:3000' }
    main { true }
  end
end
