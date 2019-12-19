require 'rails_helper'

RSpec.describe Tag, type: :model do
  let!(:page) { FactoryBot.create(:site_page)}
  let!(:tag) { FactoryBot.create(:tag, value: 'test', site_page: page)}

  describe 'is valid' do
    subject { FactoryBot.build(:tag) }
    it { is_expected.to be_valid }
  end

  describe 'repeated tag for same page' do
    subject { FactoryBot.build(:tag, value: 'test', site_page: page) }
    it { expect(subject).to have(1).errors_on(:value) }
  end

  describe 'repeated tag for different pages' do
    subject {FactoryBot.build(:tag, value: 'test') }
    it { is_expected.to be_valid }
  end
end
