require 'rails_helper'

RSpec.describe MapVersion, type: :model do

  describe 'valid map version' do
    subject { FactoryBot.build(:map_version) }
    it { is_expected.to be_valid }
  end

  describe 'cannot have empty versions' do
    subject { FactoryBot.build(:map_version, version: nil) }
    it { is_expected.to have(1).errors_on(:version) }
  end

  describe 'cannot have duplicate versions' do
    FactoryBot.create(:map_version, version: '10')
    subject { FactoryBot.build(:map_version, version: '10') }
    it { is_expected.to have(1).errors_on(:version) }
  end
end
