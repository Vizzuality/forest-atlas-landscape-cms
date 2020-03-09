require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe Management::WidgetsController do
  include SpecTestHelper
  include_context :gon

  let_it_be(:manager) { FactoryBot.create(:user) }
  let_it_be(:context) do
    context = FactoryBot.create(:context)
    FactoryBot.create(:context_user, context: context, user: manager)
    FactoryBot.create(:context_dataset, context: context)
    context
  end
  let_it_be(:site) { FactoryBot.create(:site_with_contexts, contexts: [context]) }
  let_it_be(:widget_id) { '3928a9ea-32e2-4120-b1f6-331532bf7e82' }

  context 'Signed in' do
    before do
      @test_session = ActionController::TestSession.new
    end

    before do
      allow(controller).to receive(:session).and_return(@test_session)

      sign_in manager, @test_session
    end

    before do
      allow(ApiService).to receive(:connect).and_return(Faraday.new)
      allow(DatasetService).to receive(:get_metadata_list) {
        JSON.parse(File.read(
          "#{Rails.root}/spec/support/fixtures/requests/dataset_service_get_metadata_list.json"
        ))
      }
      allow(WidgetService).to receive(:from_datasets) {
        widgets_json = JSON.parse(File.read(
          "#{Rails.root}/spec/support/fixtures/requests/widget_service_from_datasets.json"
        ))

        widgets = []
        widgets_json['data'].each do |data|
          next if data['attributes']['widget'].blank?
          data.dig('attributes', 'widget').each do |data_widget|
            widget = Widget.new data_widget
            widgets.push widget
          end
        end
        widgets
      }

      allow(WidgetService).to receive(:widget).and_return(
        Widget.new(JSON.parse(File.read(
          "#{Rails.root}/spec/support/fixtures/requests/widget_service_widget.json"
        ))['data'])
      )
    end

    describe 'GET #index' do
      before do
        get :index, params: {site_slug: site.slug}
      end

      it 'set widgets' do
        expect(@controller.view_assigns['widgets']).not_to be_nil

        widgets = @controller.view_assigns['widgets']

        expect(widgets.size).to eql 1
        expect(widgets.first).to include(
          edit_url: edit_management_site_widget_step_path(
            site.slug,
            widget_id
          )
        )
        expect(widgets.first).to include(
          delete_url: management_site_widget_path(
            site.slug,
            widget_id,
            action: :delete,
            dataset: 'e22ba068-d137-4b60-9f5e-8fdf9369fae0'
          )
        )
      end
    end

    describe 'POST #destroy' do
      before do
        allow(WidgetService).to receive(:delete) {
          {valid: true, message: 'Widget deleted successfully'}
        }
      end

      context 'global' do
        before do
          post :destroy, params: {site_slug: site.slug, id: widget_id}
        end

        it 'set dataset form_step' do
          expect(flash[:notice]).to eql 'Widget deleted successfully'
        end
      end
    end
  end

  context 'Not signed in' do
    subject { get :index, params: {site_slug: site.slug} }

    it do
      expect(subject).to redirect_to(
        "#{ENV['CONTROL_TOWER_URL']}/auth?callbackUrl=#{auth_login_url}&token=true"
      )
    end
  end
end
