# == Schema Information
#
# Table name: context_sites
#
#  id                      :integer          not null, primary key
#  is_site_default_context :boolean
#  context_id              :integer
#  site_id                 :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#

class ContextSite < ApplicationRecord
  belongs_to :context
  belongs_to :site
end
