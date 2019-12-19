require 'rails_helper'

RSpec.describe ContextDataset, type: :model do

  describe 'valid context dataset' do
    subject { FactoryBot.build(:context_dataset) }
    it { is_expected.to be_valid }
  end
end
