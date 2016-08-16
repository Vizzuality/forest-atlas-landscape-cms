# == Schema Information
#
# Table name: pages
#
#  id           :integer          not null, primary key
#  site_id      :integer
#  name         :string
#  description  :string
#  uri          :string
#  url          :string
#  ancestry     :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  content      :text
#  content_type :text
#  type         :text
#

class PageTemplate < Page
end
