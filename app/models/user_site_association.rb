# == Schema Information
#
# Table name: user_site_associations
#
#  id         :integer          not null, primary key
#  site_id    :integer
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  role       :integer          default(3)
#

class UserSiteAssociation < ApplicationRecord
  belongs_to :site
  belongs_to :user

  scope :manager, -> { where(role: UserType::MANAGER) }
  scope :publisher, -> { where(role: UserType::PUBLISHER) }

  validates :user, uniqueness: {scope: :site}
end
