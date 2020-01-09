require 'rails_helper'

RSpec.describe SiteTemplate, type: :model do

  describe 'is valid' do
    subject { FactoryBot.build(:site_template_fa) }
    it { is_expected.to be_valid }
  end
end
