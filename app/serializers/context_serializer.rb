class ContextSerializer < ActiveModel::Serializer
  attributes :id, :name

  has_many :users, through: :context_users
  has_many :sites, through: :context_sites
  has_many :context_datasets
end
