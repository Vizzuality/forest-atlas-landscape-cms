# == Schema Information
#
# Table name: widgets
#
#  id                   :integer          not null, primary key
#  dataset_id           :string
#  api_table_name       :string
#  filters              :json
#  visualization        :string
#  fields_last_modified :datetime
#  legend               :json
#  columns              :json
#  name                 :string
#  description          :string
#

class Widget < ApplicationRecord
  belongs_to :dataset

  validate :step_validation

  cattr_accessor :form_steps do
    { pages: %w[title dataset filters visualization],
      names: %w[Title Dataset Filters Visualization] }
  end
  attr_accessor :form_step

  # Returns an array of visible columns
  def get_columns_visible
    if columns
      return JSON.parse columns
    else
      return []
    end
  end

  # Sets the columns visible as JSON
  def set_columns_visible(value)
    self.write_attribute :columns, value.to_json
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

  # Returns the SELECT part of the sql query (the visible fields)
  def get_columns_visible_sql
    if self.columns.blank?
      return ' * '
    else
      return (JSON.parse self.columns).join(', ')
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



  # Gets the number of rows for a query
  def get_row_count
    get_filtered_dataset true
  end

  # Gets a preview of the results
  def get_preview
    get_filtered_dataset false, 10
  end



  # Gets the fields of this dataset
  # TODO: THIS IS HARDCODED
  def get_fields
    DatasetService.get_fields self.dataset_id, self.api_table_name
    #DatasetService.get_fields '299ff5ce-af92-4616-9c09-5f3ca981eb65', 'index_299ff5ceaf9246169c095f3ca981eb65'
  end

  def step_validation
  end
end
