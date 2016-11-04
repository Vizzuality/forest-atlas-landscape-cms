class DatasetSetting < ActiveRecord::Base
  belongs_to :context
  belongs_to :page

  validates_presence_of :dataset_id
end
