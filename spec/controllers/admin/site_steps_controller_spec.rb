require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe Admin::SiteStepsController do
  include SpecTestHelper
  include_context :gon

  let_it_be(:admin) { FactoryBot.create(:user) }
  let_it_be(:site_template) { FactoryBot.create(:site_template_default) }
  let_it_be(:site) do
    FactoryBot.create(:site_with_style, site_template: site_template)
  end

  context 'Signed in' do
    before :all do
      @test_session = ActionController::TestSession.new
    end

    before do
      allow(controller).to receive(:session).and_return(@test_session)

      sign_in admin, @test_session
    end

    describe 'GET #new' do
      it 'redirect to the first step of site creation' do
        subject = get :new

        expect(subject).to redirect_to admin_site_step_path(id: 'name')
      end
    end

    describe 'GET #edit' do
      it 'redirect to the first step of site creation' do
        subject = get :edit, params: {id: :name, site_slug: site.slug}

        expect(subject).to redirect_to admin_site_site_step_path(id: 'name')
      end
    end

    describe 'GET #show' do
      context 'global' do
        before do
          get :show, params: {id: 'name', site_slug: site.slug}
        end

        it 'set breadcrumbs' do
          expect(@controller.view_assigns['breadcrumbs']).to eql(
            [name: site.id ? "Editing \"#{site.name}\"" : 'New Site']
          )
        end

        it 'set gon site throught gon' do
          expect(gon['site']).to eq site
        end

        it 'set users throught gon' do
          expect(gon['users']).to eq User.where(admin: false).order(:name)
        end
      end

      context 'when access to name step' do
        before do
          get :show, params: {id: 'name', site_slug: site.slug}
        end

        it 'set url_controller_id throught gon' do
          expect(Gon::Global.url_controller_id).to eql(
            Admin::SiteStepsController::URL_CONTROLLER_ID
          )
        end

        it 'set url_controller_name throught gon' do
          expect(Gon::Global.url_controller_name).to eql(
            Admin::SiteStepsController::URL_CONTROLLER_NAME
          )
        end

        it 'set url_array throught gon' do
          expect(Gon::Global.url_array).to eql(
            site.routes.order(main: :desc, id: :asc).to_a
          )
        end
      end

      context 'when access to users step' do
        let!(:user) { FactoryBot.create(:user, admin: false) }
        let!(:another_user) { FactoryBot.create(:user, admin: false) }

        before do
          FactoryBot.create(:user_site_association, user: user, site: site, selected: '1')
          site.reload
          get :show, params: {id: 'users', site_slug: site.slug}
        end

        it 'build an user site association for non admin users' do
          user_site_associations = site.user_site_associations
          expect(user_site_associations.size).to eql 2
          expect(user_site_associations.last.user_id).to eql(
            user.id
          )
        end
      end

      context 'when access to contexts step' do
        before do
          get :show, params: {id: 'contexts', site_slug: site.slug}
        end

        it 'set contexts' do
          expect(@controller.view_assigns['contexts'].to_a).to eql(
            Context.all.to_a
          )
        end
      end

      context 'when access to template step' do
        before do
          get :show, params: {id: 'template', site_slug: site.slug}
        end

        it 'set color settings' do
          # Do nothing, call an empty method
        end
      end

      context 'when access to content step' do
        before do
          get :show, params: {id: 'content', site_slug: site.slug}
        end

        it 'set site settings' do
          expect(@controller.view_assigns['logo_image']).not_to be_nil
          expect(@controller.view_assigns['main_images']).not_to be_nil
          expect(@controller.view_assigns['alternative_image']).not_to be_nil
          expect(@controller.view_assigns['favico']).not_to be_nil
        end

        it 'set main_images thought gon' do
          expect(Gon::Global.main_images).not_to be_nil
        end
      end

      context 'when access to settings step' do
        before do
          get :show, params: {id: 'settings', site_slug: site.slug}
        end

        it 'set site settings' do
          expect(@controller.view_assigns['default_site_language']).not_to be_nil
          expect(@controller.view_assigns['translate_english']).not_to be_nil
          expect(@controller.view_assigns['translate_spanish']).not_to be_nil
          expect(@controller.view_assigns['translate_french']).not_to be_nil
          expect(@controller.view_assigns['translate_georgian']).not_to be_nil
          expect(@controller.view_assigns['transifex_api_key']).not_to be_nil
        end
      end

      context 'when access to style step' do
        before do
          get :show, params: {id: 'style', site_slug: site.slug}
        end

        it 'set color_controller_id thought gon' do
          expect(Gon::Global.color_controller_id).to eql(
            Admin::SiteStepsController::COLOR_CONTROLLER_ID
          )
        end

        it 'set color_controller_name thought gon' do
          expect(Gon::Global.color_controller_name).to eql(
            Admin::SiteStepsController::COLOR_CONTROLLER_NAME
          )
        end

        it 'set color_controller_id thought gon' do
          color_array =
            site.site_settings.find { |ss| ss.name == 'header-country-colours' }
          expect(Gon::Global.color_array).to eql(
            color_array&.value&.split(' ')&.map { |x| {color: x} }
          )
        end
      end
    end

    describe 'PUT #update' do
      before do
        @test_session[:site] = {}
        @test_session[:site][site.id] = site.attributes
      end

      context 'when update name step' do
        context 'when information is valid' do
          let(:valid_site_info) do
            {
              name: 'testing',
              routes_attributes: {'0': {host: 'https://testing.com'}}
            }
          end

          it 'redirect the user to the users step' do
            put :update, params: {
              id: :name,
              site_slug: site.slug,
              site: valid_site_info,
              button: 'Continue'
            }
            expect(response).to redirect_to admin_site_site_step_path(site_slug: site.slug, id: 'users')
          end
        end

        context 'when information is not valid' do
          let(:invalid_site_info) { {name: ''} }

          it 'redirect the user to the users step' do
            put :update, params: {
              id: :name,
              site_slug: site.slug,
              site: invalid_site_info,
              button: 'Continue'
            }
            expect(response).not_to redirect_to admin_site_site_step_path(site_slug: site.slug, id: 'users')
          end
        end
      end

      context 'when update users step' do
        context 'when information is valid' do
          let(:user) { FactoryBot.create(:user, admin: false) }
          let(:valid_site_info) do
            {
              user_site_associations_attributes: {
                '0': {id: '', user_id: user.id, selected: '1', role: '3'}
              }
            }
          end

          it 'redirect the user to the contexts step' do
            put :update, params: {
              site: valid_site_info,
              button: 'Continue',
              site_slug: site.slug,
              id: 'users'
            }
            expect(response).to redirect_to admin_site_site_step_path(site_slug: site.slug, id: 'contexts')
          end
        end
      end

      context 'when update contexts step' do
        context 'when information is valid' do
          let(:context) { FactoryBot.create(:context) }
          let(:valid_site_info) do
            {context_sites_attributes: {'0': {context_id: context.id}}}
          end

          it 'redirect the user to the settings step' do
            put :update, params: {
              site: valid_site_info,
              button: 'Continue',
              site_slug: site.slug,
              id: 'contexts'
            }
            expect(response).to redirect_to admin_site_site_step_path(site_slug: site.slug, id: 'settings')
          end
        end

        context 'when information is invalid' do
          let(:invalid_site_info) do
            {context_sites_attributes: {'0': {context_id: '1'}}}
          end

          it 'not redirect the user to the settings step' do
            put :update, params: {
              site: invalid_site_info,
              button: 'Continue',
              site_slug: site.slug,
              id: 'contexts'
            }
            expect(response).not_to redirect_to admin_site_site_step_path(site_slug: site.slug, id: 'settings')
          end
        end
      end

      context 'when update settings step' do
        context 'when information is valid' do
          let(:valid_site_info) do
            {
              site_settings_attributes: {
                '0': {position: 7, name: 'translate_english', value: 1}
              }
            }
          end

          it 'redirect the user to the template step' do
            put :update, params: {
              site: valid_site_info,
              button: 'Continue',
              site_slug: site.slug,
              id: 'settings'
            }
            expect(response).to redirect_to admin_site_site_step_path(site_slug: site.slug, id: 'template')
          end
        end

        context 'when information is invalid' do
          let(:invalid_site_info) do
            {
              site_settings_attributes: {
                '0': {position: nil, name: nil, value: 1}
              }
            }
          end

          it 'not redirect the user to the template step' do
            put :update, params: {
              site: invalid_site_info,
              button: 'Continue',
              site_slug: site.slug,
              id: 'settings'
            }
            expect(response).not_to redirect_to admin_site_site_step_path(site_slug: site.slug, id: 'template')
          end
        end
      end

      context 'when update template step' do
        context 'when information is valid' do
          let(:site_template) { FactoryBot.create :site_template_default }
          let(:valid_site_info) do
            {site_template_id: site_template.id}
          end

          it 'redirect the user to the style step' do
            put :update, params: {
              site: valid_site_info,
              button: 'Continue',
              site_slug: site.slug,
              id: 'template'
            }
            expect(response).to redirect_to admin_site_site_step_path(site_slug: site.slug, id: 'style')
          end
        end

        context 'when information is invalid' do
          let(:site_template) { FactoryBot.create :site_template_default }
          let(:invalid_site_info) do
            {site_template_id: nil}
          end

          it 'not redirect the user to the style step' do
            put :update, params: {
              site: invalid_site_info,
              button: 'Continue',
              site_slug: site.slug,
              id: 'template'
            }
            expect(response).not_to redirect_to admin_site_site_step_path(site_slug: site.slug, id: 'style')
          end
        end
      end

      context 'when update style step' do
        context 'when information is valid' do
          let(:valid_site_info) do
            {
              site_settings_attributes: {
                '0': {name: 'header_separators', position: 10, value: '#'}
              }
            }
          end

          it 'redirect the user to the content step' do
            put :update, params: {
              site: valid_site_info,
              button: 'Continue',
              site_slug: site.slug,
              id: 'style'
            }
            expect(response).to redirect_to admin_site_site_step_path(site_slug: site.slug, id: 'content')
          end
        end

        context 'when information is invalid' do
          let(:invalid_site_info) do
            {
              site_settings_attributes: {
                '0': {name: 'invalid', position: 1, value: nil}
              }
            }
          end

          it 'not redirect the user to the content step' do
            put :update, params: {
              site: invalid_site_info,
              button: 'Continue',
              site_slug: site.slug,
              id: 'style'
            }
            expect(response).not_to redirect_to admin_site_site_step_path(site_slug: site.slug, id: 'content')
          end
        end
      end

      context 'when update content step' do
        context 'when information is valid' do
          let(:valid_site_info) do
            {
              site_settings_attributes: {
                '0': {name: 'logo_image', position: 2, value: '#00ff00'}
              }
            }
          end

          it 'redirect the user to the sites list' do
            put :update, params: {
              site: valid_site_info,
              button: 'Continue',
              site_slug: site.slug,
              id: 'content'
            }
            expect(response).to redirect_to admin_sites_path
          end
        end

        context 'when information is invalid' do
          let(:invalid_site_info) do
            {
              site_settings_attributes: {
                '0': {name: 'invalid', position: 1, value: nil}
              }
            }
          end

          it 'not redirect the user to sites list' do
            put :update, params: {
              site: invalid_site_info,
              button: 'Continue',
              site_slug: site.slug,
              id: 'content'
            }
            expect(response).not_to redirect_to admin_sites_path
          end
        end
      end
    end
  end

  context 'Not signed in' do
    describe 'New site' do
      subject { get :show, params: {id: :name} }

      it { expect(subject).to redirect_to "#{ENV['CONTROL_TOWER_URL']}/auth?callbackUrl=#{auth_login_url}&token=true" }
    end
  end
end
