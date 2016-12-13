# == Schema Information
#
# Table name: dataset_settings
#
#  id                   :integer          not null, primary key
#  site_page_id         :integer
#  context_id           :integer
#  dataset_id           :string           not null
#  filters              :json
#  columns_visible      :json
#  columns_changeable   :json
#  default_graphs       :json
#  default_map          :json
#  api_table_name       :string
#  fields_last_modified :string
#

# Filters: The filters that will be in the SQL WHERE clause. Stored in JSON
# Columns Visible: The columns chosen on the SQL SELECT clause
# Columns Changeable: The columns the user can filter from

class DatasetSetting < ApplicationRecord
  belongs_to :context
  belongs_to :site_page, foreign_key: 'site_page_id', inverse_of: :dataset_setting

  validates_presence_of :dataset_id
  before_save :update_timestamp
  validate :columns_changeable_must_be_formatted
  validate :columns_visible_must_be_formatted
  validate :filters_must_be_formatted

  # Gets the fields of this dataset
  def get_fields
    DatasetService.get_fields self.dataset_id, self.api_table_name
  end

  # Sets the columns visible as JSON
  def set_columns_visible(value)
    self.write_attribute :columns_visible, value.to_json
  end

  # Sets the columns changeable as JSON
  def set_columns_changeable(value)
    self.write_attribute :columns_changeable, value.to_json
  end

  # Sets the filters as JSON
  def set_filters(value)
    valid = []
    value.each do |filter|
      if ((filter['name'] && filter['to'] && filter['from']) ||
        (filter['name'] && filter['values']))
        valid << filter
      end
    end
    self.write_attribute :filters, valid.to_json
  end

  # Returns the changeable columns
  def get_columns_changeable_string
    if self.columns_changeable.blank?
      return ''
    else
      return (JSON.parse self.columns_changeable).join(', ')
    end
  end

  # Returns the SELECT part of the sql query (the visible fields)
  def get_columns_visible_sql
    if self.columns_visible.blank?
      return ' * '
    else
      return (JSON.parse self.columns_visible).join(', ')
    end
  end

  # Returns an array of changeable columns
  def get_columns_changeable
    if columns_changeable
      return JSON.parse columns_changeable
    else
      return []
    end
  end

  # Returns an array of visible columns
  def get_columns_visible
    if columns_visible
      return JSON.parse columns_visible
    else
      return []
    end
  end

  # Returns the WHERE part of the sql query (the filters)
  def get_filters_sql
    if self.filters.blank?
      return ''
    else
      conditions = JSON.parse self.filters
      sql_array = []
      conditions.each do |condition|
        if condition['values']
          sql_array << " #{condition['name']} in (#{condition['values']})"
        else
          sql_array << " #{condition['name']} between #{condition['from']} and #{condition['to']}"
        end
      end
      sql_array.join(' AND ')
    end
  end


  # Gets this dataset filtered
  # Params
  # +count+:: When true, it performs a count
  def get_filtered_dataset(count = false, limit = 10000)
    selector = if count
               ' count(*) '
               else
                 get_columns_visible_sql
               end

    query = "select #{selector}"
    query += " from #{self.api_table_name} "
    query += 'where ' + get_filters_sql unless self.filters.blank? || JSON.parse(self.filters).blank?
    query += " limit #{limit}"

    DatasetService.get_filtered_dataset self.dataset_id, query
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

  # Validates the format of filters
  def filters_must_be_formatted
    if filters
      begin
        formatted = JSON.parse(filters)
        formatted.each do |f|
          unless f.is_a?(Hash)
            errors.add(:filters, 'Incorrect format')
          else
            if f['name'].blank?
              errors.add(:filters, 'No field defined')
            else
              if f['values'].blank? && (f['to'].blank? || f['from'].blank?)
                errors.add(:filters, "Column #{f['name']} has incorrect values")
              end
            end
          end
        end
      rescue
        errors.add(:filters, 'Error parsing the filters')
      end
    end
  end

  # Validates the format of columns_visible
  def columns_visible_must_be_formatted
    if columns_visible
      begin
        formatted = JSON.parse(columns_visible)
        formatted.each do |f|
          unless f.is_a?(Numeric) || f.is_a?(String) || f.is_a?(Date)
            errors.add(:columns_visible, "#{f} is not a number, string, nor date")
          end
        end
      rescue
        errors.add(:columns_visible, 'Error parsing the visible columns')
      end
    end
  end

  # Validates the format of columns_visible
  def columns_changeable_must_be_formatted
    if columns_changeable
      begin
        formatted = JSON.parse(columns_changeable)
        formatted.each do |f|
          unless f.is_a?(Numeric) || f.is_a?(String) || f.is_a?(Date)
            errors.add(:columns_changeable, "#{f} is not a number, string, nor date")
          end
        end
      rescue
        errors.add(:columns_changeable, 'Error parsing the changeable columns')
      end
    end
  end

end
