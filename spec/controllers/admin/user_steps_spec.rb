require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe Admin::UserStepsController do
  include SpecTestHelper

  let!(:admin) { FactoryBot.create(:user) }
  let!(:user_1) { FactoryBot.create(:user, admin: false) }
  let!(:context_1) { FactoryBot.create(:context)}

  # context 'Signed in' do
  #   before :all do
  #     @test_session = ActionController::TestSession.new
  #   end
  #
  #   before do
  #     controller.stub session: @test_session
  #     sign_in admin, @test_session
  #   end
  #
  #   describe 'Create new user' do
  #     subject { get :new }
  #     it { expect(subject).to redirect_to admin_user_step_path(id: 'name') }
  #
  #     let(:update_sites) do
  #       put :update, params: {
  #         user: { user_site_associations_attributes: { '0': { site_id: site1.id, selected: '1'}}},
  #         button: 'Continue', id: 'sites'
  #         }
  #     end
  #     it { expect(:update_sites).to redirect_to admin_user_step_path(id: 'contexts')}
  #
  #     let(:update_contexts) do
  #       put :update, params: {
  #         user: { context_ids: [ context_1.id ]},
  #         button: 'Save', id: 'contexts'
  #       }
  #     end
  #     it { expect(:update_contexts).to redirect_to admin_users_path }
  #   end
  # end

  context 'Not signed in' do
    describe 'New user' do
      subject { get :show, params: { id: :name } }

      it { expect(subject).to redirect_to "#{ENV['CONTROL_TOWER_URL']}/auth?callbackUrl=#{auth_login_url}&token=true" }
    end
  end
end
