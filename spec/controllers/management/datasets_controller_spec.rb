require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe Management::DatasetsController do
  include SpecTestHelper
  include_context :gon

  before :all do
    Site.destroy_all
  end

  let_it_be(:manager) { FactoryBot.create(:user) }
  let_it_be(:admin) { FactoryBot.create(:user, admin: true) }
  let_it_be(:site) { FactoryBot.create(:site_with_contexts) }
  let_it_be(:context) { Context.first }
  let_it_be(:context_user) do
    FactoryBot.create(:context_user, context: context, user: manager)
  end

  before do
    allow(ApiService).to receive(:connect).and_return(Faraday.new)
  end

  context 'Signed in' do
    before do
      @test_session = ActionController::TestSession.new
      allow(controller).to receive(:session).and_return(@test_session)

      sign_in manager, @test_session
    end

    describe 'GET #index' do
      before do
        allow(DatasetService).to receive(:get_metadata).and_return(
          JSON.parse(JSON.parse(File.read(
            "#{Rails.root}/spec/support/fixtures/requests/dataset_service_get_metadata.json"
          )))
        )
        allow(DatasetService).to receive(:get_metadata_list).and_return(
          JSON.parse(File.read(
            "#{Rails.root}/spec/support/fixtures/requests/dataset_service_get_metadata_list.json"
          ))
        )
        allow(DatasetService).to receive(:metadata_find_by_ids).and_return(
          JSON.parse(JSON.parse(File.read(
            "#{Rails.root}/spec/support/fixtures/requests/dataset_service_metadata_find_by_ids.json"
          )))
        )

        get :index, params: {site_slug: site.slug}
      end

      it 'set datasets' do
        expect(@controller.view_assigns['datasets'].size).to eql 1

        dataset = @controller.view_assigns['datasets'].first
        expect(dataset.name).to eql 'aaaa'
      end

      it 'set processed datasets information' do
        dataset = @controller.view_assigns['filtered_datasets'].first
        expect(dataset['title']['value']).to eql 'aaaa'
        expect(dataset['connector']['value']).to eql 'json'
        expect(dataset['status']['value']).to eql 'saved'
        expect(dataset['created']['value']).to eql '2019-12-15T16:35:37.726Z'
        expect(dataset['edited']['value']).to eql '2019-12-15T16:35:44.613Z'
        expect(dataset['edit']['value']).to eql(
          edit_management_site_dataset_dataset_step_path(
            site.slug,
            @controller.view_assigns['datasets'].first.id,
            id: :title
          )
        )
        expect(dataset['delete']['value']).to eql(
          management_site_dataset_path(
            site.slug,
            @controller.view_assigns['datasets'].first.id,
            action: :delete
          )
        )
      end
    end

    describe 'DELETE #destroy' do
      before do
        allow(DatasetService).to receive(:get_metadata).and_return(
          JSON.parse(JSON.parse(File.read(
            "#{Rails.root}/spec/support/fixtures/requests/dataset_service_get_metadata.json"
          )))
        )
      end

      context 'when user has needed permissions' do
        before do
          allow(DatasetService).to receive(:delete).and_return(
            valid: true, message: 'Dataset deleted successfully'
          )

          delete :destroy, params: {site_slug: site.slug, id: 'dataset_id'}
        end

        it 'destroy dataset' do
          expect(flash[:notice]).to match(/Dataset deleted successfully/)
        end

        it 'redirect user to the list of datasets' do
          expect(subject).to redirect_to(
            management_site_datasets_path(site_slug: site.slug)
          )
        end
      end

      context 'when user does not have needed permissions' do
        before do
          allow(DatasetService).to receive(:delete).and_return(
            valid: false, message: 'Dataset failed to delete'
          )

          delete :destroy, params: {site_slug: site.slug, id: 'dataset_id'}
        end

        it 'return error' do
          expect(flash[:error]).to match(/Dataset failed to delete/)
        end

        it 'redirect user to the list of datasets' do
          expect(subject).to redirect_to(
            management_site_datasets_path(site_slug: site.slug)
          )
        end
      end
    end
  end

  context 'Not signed in' do
    describe 'New site' do
      subject { get :index, params: {site_slug: site.slug} }

      it do
        expect(subject).to redirect_to(
          "#{ENV['CONTROL_TOWER_URL']}/auth?callbackUrl=#{auth_login_url}&token=true"
        )
      end
    end
  end
end
