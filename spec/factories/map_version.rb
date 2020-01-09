# == Schema Information
#
# Table name: map_versions
#
#  id               :integer          not null, primary key
#  version          :string           not null
#  position         :integer
#  description      :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  html             :text
#  default_settings :jsonb
#

FactoryBot.define do
  factory :map_version do

    sequence(:version) { |v| v.to_s }
    sequence(:position) { |p| p }
    sequence(:description) { |d| "Version #{d}"}
  end
end
