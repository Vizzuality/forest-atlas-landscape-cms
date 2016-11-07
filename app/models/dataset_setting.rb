class DatasetSetting < ApplicationRecord
  belongs_to :context
  belongs_to :page

  validates_presence_of :dataset_id

  def get_fields
    DatasetService.get_fields self.dataset_id
  end
end
