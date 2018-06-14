# == Schema Information
#
# Table name: map_versions
#
#  id          :integer          not null, primary key
#  version     :string           not null
#  position    :integer
#  description :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class MapVersion < ApplicationRecord
  validates_uniqueness_of :version
  validates_presence_of :version
end
