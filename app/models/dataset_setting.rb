class DatasetSetting < ApplicationRecord
  include ERB::Util
  belongs_to :context
  belongs_to :page

  validates_presence_of :dataset_id

  def get_fields
    DatasetService.get_fields self.dataset_id
  end

  def get_filtered_dataset
    if self.filters.blank?
      return DatasetService.get_dataset self.dataset_id
    else
      query = 'select '
      if self.columns_visible
        query += (JSON.parse self.columns_visible).join(', ')
      else
        query += '*'
      end
      query += " from #{self.api_table_name} "
      query += 'where ' + (JSON.parse self.filters).join(' AND ')
      query = url_encode(query)
      return DatasetService.get_filtered_dataset self.dataset_id, query
    end
  end
end
