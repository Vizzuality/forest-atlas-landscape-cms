require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe Admin::UserStepsController do
  include SpecTestHelper

  let!(:site) { FactoryBot.create(:site_with_routes) }

  context 'Signed in' do
    before do
      @admin = User.where(admin: true).first || FactoryBot.create(:user)

      @test_session = ActionController::TestSession.new
      @test_session[:user] = {}
      @test_session[:user][@admin.id.to_s] = {}#@admin.attributes
    end

    before do
      allow(controller).to receive(:session).and_return(@test_session)

      sign_in @admin, @test_session
    end

    describe 'GET #new' do
      subject { get :new }

      it { expect(subject).to redirect_to admin_user_step_path(id: 'identity') }
    end

    describe 'PUT #update' do
      context 'Identity step' do
        subject do
          put :update, params: {
            user: {name: 'New Name', email: 'new@email.com'},
            user_id: @admin.id,
            button: 'Continue',
            id: 'identity'
          }
        end

        it { expect(subject).to redirect_to admin_user_user_step_path(user_id: @admin.id, id: 'role') }
      end

      context 'Role step' do
        subject do
          put :update, params: {
            user: {admin: false},
            user_id: @admin.id,
            button: 'Continue',
            id: 'role'
          }
        end

        it { expect(subject).to redirect_to admin_user_user_step_path(id: 'sites') }
      end

      context 'Sites step' do
        subject do
          put :update, params: {
            user: {
              user_site_associations_attributes: {
                '0': {site_id: site.id, selected: '1'}
              }
            },
            user_id: @admin.id,
            button: 'Continue',
            id: 'sites'
          }
        end

        it { expect(subject).to redirect_to admin_user_user_step_path(id: 'contexts') }
      end

      context 'Contexts step' do
        subject do
          put :update, params: {
            user: {context_ids: [Context.first.id]},
            button: 'Save',
            user_id: @admin.id,
            id: 'contexts'
          }
        end

        it { expect(subject).to redirect_to admin_users_path }
      end
    end
  end

  context 'Not signed in' do
    describe 'New user' do
      subject { get :show, params: {id: :name} }

      it { expect(subject).to redirect_to "#{ENV['CONTROL_TOWER_URL']}/auth?callbackUrl=#{auth_login_url}&token=true" }
    end
  end
end
