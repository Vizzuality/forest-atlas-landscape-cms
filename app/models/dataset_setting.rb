class DatasetSetting < ApplicationRecord
  belongs_to :context
  belongs_to :site_page, foreign_key: 'site_page_id', inverse_of: :dataset_setting

  validates_presence_of :dataset_id
  before_save :update_timestamp

  # Gets the fields of this dataset
  def get_fields
    DatasetService.get_fields self.dataset_id, self.api_table_name
  end

  # Gets this dataset filtered
  # Params
  # +count+:: When true, it performs a count
  def get_filtered_dataset(count = false, limit = 10000)
    selector = count ? ' count(*) ' : ' * '
    if self.filters.blank?
      query = "select #{selector} from #{self.api_table_name} limit #{limit}"
      return DatasetService.get_filtered_dataset self.dataset_id, query
    else
      query = 'select '
      if self.columns_visible
        query += (JSON.parse self.columns_visible).join(', ')
      else
        query += " #{selector} "
      end
      query += " from #{self.api_table_name} "
       query += 'where ' + (JSON.parse self.filters).join(' AND ') if self.filters.length > 0
      query += " limit #{limit}"
      return DatasetService.get_filtered_dataset self.dataset_id, query
    end
  end

  # Gets the number of rows for a query
  def get_row_count
    get_filtered_dataset true
  end

  # Gets a preview of the results
  def get_preview
    get_filtered_dataset false, 10
  end

  # Gets this dataset's table name
  def get_table_name
    (DatasetService.get_dataset self.dataset_id).dig('data', 'attributes', 'tableName')
  end

  private
  # Updates this timestamp (used to invalidate old searches)
  def update_timestamp
    self.fields_last_modified = {
      columns_changeable: self.columns_changeable,
      columns_visible: self.columns_visible,
      filters: self.filters}.hash.to_s(36)[1..5]
  end
end
