require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe Admin::SiteStepsController do
  include SpecTestHelper

  let!(:admin) { FactoryBot.create(:user) }
  let!(:user_1) { FactoryBot.create(:user, admin: false) }
  let!(:site1) { FactoryBot.create(:site_with_routes) }
  let!(:site2) { FactoryBot.create(:site_with_routes) }
  let!(:site3) { FactoryBot.create(:site_with_routes) }
  let!(:context_1) { }

  context 'Signed in' do
    before :all do
      @test_session = ActionController::TestSession.new
    end

    before do
      controller.stub session: @test_session
      sign_in admin, @test_session
    end

    describe 'Create new site' do
      subject { get :new }
      it { expect(subject).to redirect_to admin_site_step_path(id: 'name') }

      let(:update_name) do
        put :update, params: {
          id: :name, site: { name: 'testing', routes_attributes: { '0': { host: 'https://testing.com'}}},
          button: 'Continue' }
      end
      it { expect(update_name).to redirect_to admin_site_step_path(id: 'users') }

      let(:update_users) do
        put :update, params: {
          site: { user_site_associations_attributes: { '0': { id: '', user_id: user_1.id, selected: '1', role: '3'}}},
          button: 'Continue', id: 'users' }
      end
      it { expect(update_users).to redirect_to admin_site_step_path(id: 'contexts') }

      let(:update_contexts) do
        put :update, params: {
          site: { context_sites_attributes: { '0': { context_id: '1'}}},
          button: 'Continue', id: 'contexts' }
      end
      it { expect(update_contexts).to redirect_to admin_site_step_path(id: 'settings') }

      let(:update_settings) do
        put :update, params: {
          site: { site_settings_attributes: {
            '0': { position: 7, name: 'translate_english', value: 1 },
            '1': { position: 9, name: 'translate_spanish', value: 1 },
            '2': { position: 8, name: 'translate_french', value: 1 },
            '3': { position: 16, name: 'translate_georgian', value: 1 },
            '4': { position: 15, name: 'default_site_language', value: 'fr' },
            '5': { position: 16, name: 'transifex_api_key', value: "#{SecureRandom.uuid}" },
            '6': { position: 10, name: 'pre_footer', value: '' },
            '7': { position: 11, name: 'analytics_key', value: "#{SecureRandom.uuid}" },
            '8': { position: 12, name: 'keywords', value: 'test1, test2' },
            '9': { position: 12, name: 'contact_email_address', value: "#{user_1.email}" },
            '10': { position: 12, name: 'hosting_organization', value: '' }
          }}, button: 'Continue', id: 'settings' }
      end
      it { expect(update_settings).to redirect_to admin_site_step_path(id: 'template') }

      # let(:update_template) do
      #   put :update, params: {
      #     site: { site_template_id: site1.site_template.id },
      #     button: 'Continue', id: 'template'
      #   }
      # end
      # it { expect(update_template).to redirect_to admin_site_step_path(id: 'style' )}
      #
      # let(:update_style) do
      #   put :update, params: {
      #     site: { site_settings_attributes: {
      #       '0':  { name: 'color', position: '1', value: '97bd3d' },
      #       '1':  { name: 'content_width', position: '20', value: '1280px' },
      #       '2':  { name: 'content_font', position: '21', value: "'Merriweather Sans'" },
      #       '3':  { name: 'heading_font', position: '22', value: "'Merriweather'" },
      #       '4':  { name: 'cover_size', position: '23', value: '250px' },
      #       '5':  { name: 'cover_text_alignment', position: '24', value: 'left' },
      #       '6':  { name: 'header_separators', position: '25', value: 'false' },
      #       '7':  { name: 'header_background', position: '26', value: 'white' },
      #       '8':  { name: 'header_transparency', position: '27', value: "'semi'" },
      #       '9':  { name: 'header-country-colours', position: '28', value: '#000000' },
      #       '10': { name: 'footer_background', position: '29', value: "'accent-color'" },
      #       '11': { name: 'footer_text_color', position: '30', value:  "'white'" },
      #       '12': { name: 'footer-links-color', position: '31', value: "'white'" }
      #     }}, "button"=>"Continue", "id"=>"style" }
      # end
      # it { expect(update_style).to redirect_to admin_site_step_path(id: 'content' )}
      #
      # let(:uploaded_image) { fixture_file_upload('spec/support/fixtures/images/image1.jpg')}
      #
      # let(:update_content) do
      #   put :update, params: {
      #     site: { site_settings_attributes: {
      #       '1':  { position: '2',  name: 'logo_image', image: uploaded_image },
      #       '2':  { position: '3',  name: 'favico', image: uploaded_image },
      #       '3':  { position: '6',  name: 'alternative_image', image: uploaded_image, attribution_label: '', attribution_link: ''},
      #       '30': { position: '30', name:'main_image', image: uploaded_image, id: '',  _destroy: '0', attribution_label: '', attribution_link:''},
      #       #'30': { position: '30', name:'main_image', image: '/system/temporary_content_images/images/000/000/006/original/74674916_10156310811442447_7045285948006858752_n.jpg?1572956945&temp_id=6', id: '',  _destroy: '0', attribution_label: '', attribution_link:''},
      #       }}, button: 'Save', id: 'content' }
      # end
      # it { expect(update_content).to redirect_to admin_sites_path}
    end
  end

  context 'Not signed in' do
    describe 'New site' do
      subject { get :show, params: { id: :name } }

      it { expect(subject).to redirect_to "#{ENV['CONTROL_TOWER_URL']}/auth?callbackUrl=#{auth_login_url}&token=true" }
    end
  end
end
