# == Schema Information
#
# Table name: context_users
#
#  id               :integer          not null, primary key
#  is_context_admin :boolean
#  context_id       :integer
#  user_id          :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  role             :integer          default(1)
#

 # == Schema Information
#
# Table name: context_users
#
#  id               :integer          not null, primary key
#  is_context_admin :boolean
#  context_id       :integer
#  user_id          :integer
#  role             :integer          default 1
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class ContextUser < ApplicationRecord
  belongs_to :context
  belongs_to :user

  #scope :owner, -> { where(role: UserRole::OWNER) }
  #scope :writer, -> { where(role: UserRole::WRITER) }

  scope :owner, -> { where(role: 1) }
  scope :writer, -> { where(role: 2) }

  validates_presence_of :role
  #validates_inclusion_of :role, in: UserRole
end
