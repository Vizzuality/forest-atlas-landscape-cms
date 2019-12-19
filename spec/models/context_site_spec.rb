require 'rails_helper'

RSpec.describe ContextSite, type: :model do

  describe 'valid context site' do
    subject { FactoryBot.build(:context_site) }
    it { is_expected.to be_valid }
  end
end
