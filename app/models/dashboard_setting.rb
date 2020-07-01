# == Schema Information
#
# Table name: dashboard_settings
#
#  id             :integer          not null, primary key
#  page_id        :integer
#  widget_id      :string
#  dataset_id     :string
#  content_top    :json
#  content_bottom :json
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  columns        :string
#

class DashboardSetting < ApplicationRecord
  belongs_to :site_page, foreign_key: 'page_id',
                         inverse_of: :dashboard_setting,
                         autosave: true
end
