# == Schema Information
#
# Table name: page_widgets
#
#  id        :integer          not null, primary key
#  page_id   :integer
#  widget_id :string
#

class PageWidget < ActiveRecord::Base
  belongs_to :page
  belongs_to :widget
end
