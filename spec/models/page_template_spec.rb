require 'rails_helper'

RSpec.describe PageTemplate, type: :model do
  describe 'is valid' do
    subject { FactoryBot.build(:page_template) }
    it { is_expected.to be_valid }
  end
end
