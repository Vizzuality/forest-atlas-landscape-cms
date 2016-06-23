# == Schema Information
#
# Table name: sites
#
#  id          :integer          not null, primary key
#  template_id :integer
#  name        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Site < ApplicationRecord
  belongs_to :template
  has_many :routes
  has_many :pages

end
