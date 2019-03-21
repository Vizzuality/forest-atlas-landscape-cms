# == Schema Information
#
# Table name: map_versions
#
#  id               :integer          not null, primary key
#  version          :string           not null
#  position         :integer
#  description      :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  html             :text
#  default_settings :jsonb
#

class MapVersion < ApplicationRecord
  validates_uniqueness_of :version
  validates_presence_of :version

  before_save :format_default_settings

  private

  def format_default_settings
    return if self.default_settings.blank?
    self.default_settings =
      {
        'version': self.version,
        'settings': default_settings
      }
  end
end
