require 'rails_helper'

RSpec.describe Widget, type: :model do
  describe 'valid widget' do
    subject { FactoryBot.build(:widget) }
    it { is_expected.to be_valid }
  end
end
