require 'rails_helper'

RSpec.describe Dataset, type: :model do
  describe 'valid dataset' do
    subject { FactoryBot.build(:dataset) }
    it { is_expected.to be_valid }
  end
end
