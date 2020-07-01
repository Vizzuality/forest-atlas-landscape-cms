require 'rails_helper'

RSpec.describe Dataset, type: :model do
  describe 'valid dataset' do
    subject { FactoryBot.build(:dataset, form_step: 'title') }
    it { is_expected.to be_valid }
  end
end
