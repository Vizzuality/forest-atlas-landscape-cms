# == Schema Information
#
# Table name: pages
#
#  id          :integer          not null, primary key
#  site_id     :integer
#  name        :string
#  description :string
#  uri         :string
#  url         :string
#  ancestry    :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  content     :text
#

class PageSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :url, :parent_id
end
