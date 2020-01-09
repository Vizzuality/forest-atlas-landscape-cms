require 'rails_helper'

RSpec.describe DashboardSetting, type: :model do

  describe 'valid context dataset' do
    subject { FactoryBot.build(:dashboard_setting) }
    it { is_expected.to be_valid }
  end
end
