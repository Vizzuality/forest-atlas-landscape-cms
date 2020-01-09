require 'rails_helper'

RSpec.describe Context, type: :model do

  describe 'valid context' do
    subject { FactoryBot.build(:context) }
    it { is_expected.to be_valid }
  end
end
