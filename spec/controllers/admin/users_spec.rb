require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe Admin::UsersController do
  include SpecTestHelper

  let!(:admin) { FactoryBot.create(:user) }
  let!(:user1) { FactoryBot.create(:user, admin: false) }
  let!(:user2) { FactoryBot.create(:user, admin: false) }

  context 'Signed in' do
    before { sign_in admin }

    describe 'List users' do
      subject { get :index }

      it { is_expected.to be_successful }
    end
  end

  context 'Not signed in' do
    describe 'List users' do
      subject { get :index }

      it { expect(subject).to redirect_to "#{ENV['CONTROL_TOWER_URL']}/auth?callbackUrl=#{auth_login_url}&token=true" }
    end
  end
end
