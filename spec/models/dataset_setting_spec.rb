require 'rails_helper'

RSpec.describe DatasetSetting, type: :model do
  describe 'valid dataset setting' do
    subject { FactoryBot.create(:dataset_setting) }
    it { is_expected.to be_valid }
    it { expect(subject.fields_last_modified).not_to be(nil)}
  end

  describe 'no dataset id' do
    subject { FactoryBot.build(:dataset_setting, dataset_id: nil)}
    it { is_expected.to have(1).errors_on(:dataset_id) }
  end
end
