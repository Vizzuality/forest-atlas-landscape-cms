# == Schema Information
#
# Table name: contexts
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class ContextSerializer < ActiveModel::Serializer
  attributes :id, :name

  has_many :users, through: :context_users
  has_many :sites, through: :context_sites
  has_many :context_datasets
end
