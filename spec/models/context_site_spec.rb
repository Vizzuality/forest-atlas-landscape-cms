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

require 'rails_helper'

RSpec.describe ContextSite, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
