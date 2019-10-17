require 'rails_helper'

RSpec.describe PageWidget, type: :model do

  describe 'valid page widget' do
    subject { FactoryBot.build(:page_widget) }
    it { is_expected.to be_valid }
  end
end
