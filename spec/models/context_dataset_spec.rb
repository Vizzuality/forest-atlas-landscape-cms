# == Schema Information
#
# Table name: context_datasets
#
#  id                         :integer          not null, primary key
#  is_confirmed               :boolean
#  is_dataset_default_context :boolean
#  context_id                 :integer
#  dataset_id                 :integer
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#

require 'rails_helper'

RSpec.describe ContextDataset, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
