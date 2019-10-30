# == Schema Information
#
# Table name: page_widgets
#
#  id        :integer          not null, primary key
#  page_id   :integer
#  widget_id :string
#

# TODO: REMOVE
class PageWidget < ActiveRecord::Base
  belongs_to :page, dependent: :destroy
  belongs_to :widget
end
