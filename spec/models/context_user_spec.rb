# == Schema Information
#
# Table name: context_users
#
#  id               :integer          not null, primary key
#  is_context_admin :boolean
#  context_id       :integer
#  user_id          :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

require 'rails_helper'

RSpec.describe ContextUser, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
