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
    { pages: %w[title dataset filters columns visualization preview],
      names: %w[Title Dataset Filters Columns Visualization Preview] }
  end
  attr_accessor :form_step
end
