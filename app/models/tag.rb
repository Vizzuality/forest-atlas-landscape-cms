# == Schema Information
#
# Table name: tags
#
#  id         :integer          not null, primary key
#  value      :string           not null
#  page_id    :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Tag < ApplicationRecord
  belongs_to :site_page, foreign_key: :page_id, optional: true

  validates_presence_of :value
  validates_uniqueness_of :value, scope: :page_id
end
