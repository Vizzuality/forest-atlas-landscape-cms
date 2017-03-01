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
  has_many :page_widgets
  has_many :pages, through: :page_widgets

  cattr_accessor :form_steps do
    { pages: %w[title dataset filters visualization],
      names: %w[Title Dataset Filters Visualization] }
  end
  attr_accessor :form_step

  validate :step_validation
  before_destroy :prevent_destroy_if_dependent_pages_present

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
      if (!filter['name'].blank? && !filter['to'].blank? && !filter['from'].blank?)
        valid << filter
      elsif (filter['name'] && filter['values'])
        filter['values'] = JSON.parse(filter['values'])
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
    query += " from #{self.api_table_name}"
    query += ' where ' + get_filters_sql unless self.filters.blank? || JSON.parse(self.filters).blank?
    query += " limit #{limit}" if limit

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
          values = condition['values'].map{|x| "'#{x}'"}.join(',')
          sql_array << " #{condition['name']} in (#{values})"
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
  def get_fields
    DatasetService.get_fields self.dataset_id, self.api_table_name
  end

  def step_validation
    step_index = form_steps[:pages].index(form_step)

    if self.form_steps[:pages].index('title') <= step_index
      self.errors['name'] << 'You must enter a title for the widget' if self.name.blank? || self.name.strip.blank?
      self.errors['description'] << 'You must enter a description for the widget' if self.description.blank? || self.description.strip.blank?
    end

    if self.form_steps[:pages].index('dataset') <= step_index
      self.errors['dataset_id'] << 'You must select a dataset' if self.dataset_id.blank?
      self.errors['api_table_name'] << 'You must select a dataset' if self.api_table_name.blank?
    end

    if self.form_steps[:pages].index('filters') <= step_index
      self.errors['columns'] << 'There was an error saving the filters. Please try again' if self.columns.blank?
    end

    if self.form_steps[:pages].index('visualization') <= step_index
      if self.visualization.blank?
        self.errors['visualization'] << 'You must choose a graph type and its columns'
      elsif self.visualization['type'].blank?
        self.errors['type'] << 'You must choose a graph type'
        # TODO: Put the graph logic here. Ask Clement about this
      end
    end
  end

  private
  def prevent_destroy_if_dependent_pages_present
    if pages.any?
      msg = pages.map(&:name).join(',')
      self.errors.add(:base, msg)
      throw(:abort)
    end
  end
end
