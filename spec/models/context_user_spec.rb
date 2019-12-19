require 'rails_helper'

RSpec.describe ContextUser, type: :model do

  describe 'valid context site' do
    subject { FactoryBot.build(:context_user) }
    it { is_expected.to be_valid }
  end
end
