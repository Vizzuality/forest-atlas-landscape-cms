# == Schema Information
#
# Table name: pages_site_templates
#
#  page_id          :integer          not null
#  site_template_id :integer          not null
#

class PageSiteTemplate < ApplicationRecord
  self.table_name = 'pages_site_templates'
end
