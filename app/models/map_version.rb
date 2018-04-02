class MapVersion < ApplicationRecord
  validates_uniqueness_of :version
  validates_presence_of :version
end
