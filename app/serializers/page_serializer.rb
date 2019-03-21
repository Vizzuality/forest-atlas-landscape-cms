# == Schema Information
#
# Table name: pages
#
#  id                     :integer          not null, primary key
#  site_id                :integer
#  name                   :string
#  description            :string
#  uri                    :string
#  url                    :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  content_type           :integer
#  type                   :text
#  enabled                :boolean          default(FALSE)
#  parent_id              :integer
#  position               :integer
#  content                :json
#  show_on_menu           :boolean          default(TRUE)
#  page_version           :integer          default(1)
#  thumbnail_file_name    :string
#  thumbnail_content_type :string
#  thumbnail_file_size    :integer
#  thumbnail_updated_at   :datetime
#

class PageSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :url, :parent_id
end
