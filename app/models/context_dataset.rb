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

class ContextDataset < ApplicationRecord
  belongs_to :context

end
