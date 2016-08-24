# == Schema Information
#
# Table name: sites
#
#  id               :integer          not null, primary key
#  site_template_id :integer
#  name             :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class SiteSerializer < ActiveModel::Serializer
  attributes :id, :name, :slug

  belongs_to :site_template, serializer: SiteTemplateSerializer
  has_many :users, through: :user_site_associations
end
