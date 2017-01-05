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


  cattr_accessor :form_steps do
    { pages: %w[title dataset visualization filters columns preview],
      names: %w[Title Dataset Visualization Filters Columns Preview] }
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

  # Gets the fields of this dataset
  # TODO: THIS IS HARDCODED
  def get_fields
    #DatasetService.get_fields self.dataset_id, self.api_table_name
    DatasetService.get_fields '299ff5ce-af92-4616-9c09-5f3ca981eb65', 'index_299ff5ceaf9246169c095f3ca981eb65'
  end
end
