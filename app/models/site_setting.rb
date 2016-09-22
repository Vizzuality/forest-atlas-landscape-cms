# == Schema Information
#
# Table name: site_settings
#
#  id                                           :integer          not null, primary key
#  name                                         :string           not null
#  value                                        :string           not null
#  updated_at                                   :datetime         not null
#
# index_site_settings_on_site_id_and_name       :index            unique [:site_id, :name]
#

class SiteSetting < ApplicationRecord
  belongs_to :site
  validates_uniqueness_of :name, :scope => :site_id

end
