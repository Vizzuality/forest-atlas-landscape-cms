# Table name: routes
#
#  id         :integer          not null, primary key
#  site_id    :integer
#  host       :string
#  path       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  main       :boolean          default(FALSE)
#

FactoryBot.define do
  factory :route do
    association :site

    host { 'http://localhost:3000' }
    main { true }
  end
end
