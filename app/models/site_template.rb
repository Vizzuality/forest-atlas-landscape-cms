# == Schema Information
#
# Table name: site_templates
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class SiteTemplate < ApplicationRecord
  has_many :sites
  has_and_belongs_to_many :pages
end
