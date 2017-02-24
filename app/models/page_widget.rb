class PageWidget < ActiveRecord::Base
  belongs_to :page
  belongs_to :widget
end
