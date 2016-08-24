# == Schema Information
#
# Table name: contexts
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Context < ApplicationRecord
  has_many :context_datasets
  has_many :datasets, through: :context_datasets

  has_many :context_users
  has_many :users, through: :context_users

  has_many :context_sites
  has_many :sites, through: :context_sites

end
