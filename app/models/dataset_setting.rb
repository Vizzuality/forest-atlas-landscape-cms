class DatasetSetting < ApplicationRecord
  belongs_to :context
  belongs_to :site_page, foreign_key: 'site_page_id', inverse_of: :dataset_setting

  validates_presence_of :dataset_id
  before_save :update_timestamp

  def get_fields
    DatasetService.get_fields self.dataset_id
  end

  def get_filtered_dataset
    if self.filters.blank?
      query = "select * from #{self.api_table_name} limit 10000"
      return DatasetService.get_filtered_dataset self.dataset_id, query
    else
      query = 'select '
      if self.columns_visible
        query += (JSON.parse self.columns_visible).join(', ')
      else
        query += '*'
      end
      query += " from #{self.api_table_name} "
      query += 'where ' + (JSON.parse self.filters).join(' AND ') if self.filters.length > 0
      query += ' limit 10000'
      return DatasetService.get_filtered_dataset self.dataset_id, query
    end
  end

  def get_table_name
    (DatasetService.get_dataset self.dataset_id).dig('data', 'attributes', 'tableName')
  end

  private
  def update_timestamp
    self.fields_last_modified = {
      columns_changeable: self.columns_changeable,
      columns_visible: self.columns_visible,
      filters: self.filters}.hash.to_s(36)[1..5]
  end
end
