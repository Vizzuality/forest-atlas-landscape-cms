require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe Admin::SitesController do
  include SpecTestHelper

  let!(:admin) { FactoryBot.create(:user) }
  let!(:site1) { FactoryBot.create(:site_with_routes) }
  let!(:site2) { FactoryBot.create(:site_with_routes) }
  let!(:site3) { FactoryBot.create(:site_with_routes) }

  context 'Signed in' do
    before { sign_in admin }

    describe 'List sites' do
      subject { get :index }

      it { is_expected.to be_successful }
    end
  end

  context 'Not signed in' do
    describe 'List sites' do
      subject { get :index }

      it { expect(subject).to redirect_to "#{ENV['CONTROL_TOWER_URL']}/auth?callbackUrl=#{auth_login_url}&token=true" }
    end
  end
end
