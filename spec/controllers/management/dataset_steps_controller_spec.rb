require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe Management::DatasetStepsController do
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
    allow(DatasetService).to receive(:get_metadata).and_return(
      JSON.parse(JSON.parse(File.read(
        "#{Rails.root}/spec/support/fixtures/requests/dataset_service_get_metadata.json"
      )))
    )
    allow(DatasetService).to receive(:get_fields).and_return(
      JSON.parse(JSON.parse(File.read(
        "#{Rails.root}/spec/support/fixtures/requests/dataset_service_get_fields.json"
      )))
    )
  end

  context 'Signed in' do
    before do
      @test_session = ActionController::TestSession.new
    end

    before do
      allow(controller).to receive(:session).and_return(@test_session)

      sign_in manager, @test_session
    end

    describe 'GET #new' do
      it 'redirect to the first step of site creation' do
        subject = get :new, params: {site_slug: site.slug}

        expect(subject).to redirect_to management_site_dataset_step_path(
          id: 'title',
          site_slug: site.slug
        )
      end
    end

    describe 'GET #edit' do
      it 'redirect to the first step of site creation' do
        dataset = FactoryBot.build(:dataset)
        subject = get :edit, params: {
          site_slug: site.slug,
          id: 'title',
          dataset_id: dataset.id
        }

        expect(subject).to redirect_to management_site_dataset_dataset_step_path(
          id: :title,
          site_slug: site.slug,
          dataset_id: dataset.id
        )
      end
    end

    describe 'GET #show' do
      let_it_be(:dataset) { FactoryBot.build(:dataset) }

      before do
        @test_session[:dataset_creation] = {}
        @test_session[:dataset_creation][dataset.id] =
          FactoryBot.attributes_for(:dataset).with_indifferent_access
      end

      context 'global' do
        before do
          get :show, params: {
            site_slug: site.slug,
            id: 'title'
          }
        end

        it 'set breadcrumbs' do
          expect(@controller.view_assigns['breadcrumbs']).to eql(
            [name: 'New Dataset']
          )
        end

        it 'set form_step on the dataset' do
          expect(@controller.view_assigns['dataset'].form_step).to eql('title')
        end
      end

      context 'when access to connector step' do
        before do
          get :show, params: {
            id: 'connector',
            site_slug: site.slug
          }
        end

        it 'set collector_selected thought gon' do
          expect(gon['collector_selected']).to eql nil
        end
      end

      context 'when access to context step' do
        before do
          get :show, params: {
            id: 'context',
            site_slug: site.slug
          }
        end

        it 'set user_contexts and dataset_context' do
          expect(@controller.view_assigns['user_contexts'].to_a).to match_array(
            site.contexts.to_a
          )
          expect(@controller.view_assigns['dataset_context']).to eql []
        end
      end

      context 'when access to metadata step' do
        before do
          FactoryBot.create(:site_setting_default_site_language, site: site)

          allow(DatasetService).to receive(:metadata_find_by_ids).and_return(
            JSON.parse(JSON.parse(File.read(
              "#{Rails.root}/spec/support/fixtures/requests/dataset_service_metadata_find_by_ids.json"
            )))
          )

          get :show, params: {
            id: 'metadata',
            site_slug: site.slug,
            dataset_id: dataset.id
          }
        end

        it 'set languages and default_language' do
          expect(@controller.view_assigns['languages']).to eql(
            dataset.languages
          )
          expect(@controller.view_assigns['default_language']).to eql 'fr'
        end

        it 'set metadata' do
          expect(@controller.view_assigns['metadata'].keys).to match_array(
            ['es', 'en', 'fr', 'gr', 'ka']
          )
        end
      end

      context 'when access to options step' do
        before do
          FactoryBot.create(:site_setting_default_site_language, site: site)

          allow(DatasetService).to receive(:metadata_find_by_ids).and_return(
            JSON.parse(File.read(
              "#{Rails.root}/spec/support/fixtures/requests/dataset_service_metadata_find_by_ids.json"
            ))['data']
          )

          get :show, params: {
            id: 'options',
            site_slug: site.slug,
            dataset_id: dataset.id
          }
        end

        it 'set metadata columns' do
          expect(@controller.view_assigns['metadata_id']).to eql(
            '5df660f88967b60010cd4e99'
          )
          expect(@controller.view_assigns['metadata_columns'].map(&:keys).uniq.flatten).to match_array(
            %i(name alias description)
          )
        end
      end
    end

    describe 'PUT #update' do
      let_it_be(:dataset) { FactoryBot.build(:dataset) }

      context 'global' do
        before do
          put :update, params: {
            id: 'title',
            site_slug: site.slug,
            dataset: {name: 'new name'}
          }
        end

        it 'set dataset form_step' do
          expect(@controller.view_assigns['dataset'].form_step).to eql 'title'
        end
      end

      context 'when access to title step' do
        context 'when we use valid information' do
          let(:valid_site_info) { {name: 'correct name', tags: 'tag1 tag2'} }

          it 'redirect user to the next dataset step' do
            put :update, params: {
              id: 'title',
              site_slug: site.slug,
              dataset: valid_site_info,
              button: 'CONTINUE'
            }

            expect(response).to redirect_to(
              management_site_dataset_step_path(
                id: 'connector',
                site_slug: site.slug
              )
            )
          end
        end

        context 'when we dont use valid information' do
          let(:invalid_site_info) { {name: nil, tags: nil} }

          it 'not redirect user to the next dataset step' do
            put :update, params: {
              id: 'title',
              site_slug: site.slug,
              dataset: invalid_site_info
            }

            expect(response).not_to redirect_to(
              management_site_dataset_step_path(
                id: 'connector',
                site_slug: site.slug
              )
            )
          end
        end
      end

      context 'when access to connector step' do
        context 'when we use valid information' do
          context 'when we include a csv file' do
            let(:file) do
              fixture_file_upload('files/csv_uploader.csv', 'text/csv')
            end
            let(:valid_site_info) do
              {
                name: 'name',
                connector: 'csv',
                provider: 'csv',
                type: 'document'
              }
            end

            before do
              put :update, params: {
                id: 'connector',
                site_slug: site.slug,
                dataset: valid_site_info,
                csv_uploader: file,
                button: 'CONTINUE'
              }
            end

            it 'upload the specified file and use the filename as connector' do
              expect(@controller.view_assigns['dataset'].connector_url).not_to be_nil
            end

            it 'redirect user to the next dataset step' do
              expect(response).to redirect_to(
                management_site_dataset_step_path(
                  id: 'labels',
                  site_slug: site.slug
                )
              )
            end
          end

          context 'when we dont include a csv file' do
            let(:valid_site_info) do
              {
                name: 'name',
                connector: 'json',
                provider: 'json',
                type: 'document',
                connector_url: 'http://urltojson'
              }
            end

            it 'set connector_url with the uri of the csv file' do
              put :update, params: {
                id: 'connector',
                site_slug: site.slug,
                dataset: valid_site_info,
                csv_uploader: nil,
                button: 'CONTINUE'
              }

              expect(response).to redirect_to(
                management_site_dataset_step_path(
                  id: 'labels',
                  site_slug: site.slug
                )
              )
            end
          end
        end

        context 'when we dont use valid information' do
          let(:invalid_site_info) do
            {
              connector: 'csv',
              provider: 'csv',
              type: 'document'
            }
          end

          it 'not redirect user to the next dataset step' do
            put :update, params: {
              id: 'connector',
              site_slug: site.slug,
              dataset: invalid_site_info
            }

            expect(response).not_to redirect_to(
              management_site_dataset_step_path(
                id: 'connector',
                site_slug: site.slug
              )
            )
          end
        end
      end

      context 'when access to labels step' do
        context 'when we use valid information' do
          let(:valid_site_info) do
            {
              name: 'name',
              legend: {
                lat: '111',
                long: '222',
                country: 'Spain',
                region: 'Andalucia',
                date: Date.today
              }
            }
          end

          it 'redirect user to the next dataset step' do
            put :update, params: {
              id: 'labels',
              site_slug: site.slug,
              dataset: valid_site_info,
              button: 'CONTINUE'
            }

            expect(response).to redirect_to(
              management_site_dataset_step_path(
                id: 'context',
                site_slug: site.slug
              )
            )
          end
        end

        context 'when we dont use valid information' do
          let(:invalid_site_info) { {legend: {one: 1}} }

          it 'redirect user to the next dataset step' do
            put :update, params: {
              id: 'labels',
              site_slug: site.slug,
              dataset: invalid_site_info
            }

            expect(response).not_to redirect_to(
              management_site_dataset_step_path(
                id: 'context',
                site_slug: site.slug
              )
            )
          end
        end
      end

      context 'when access to context step' do
        context 'when we use valid information' do
          let(:valid_site_info) do
            {
              name: 'name',
              context_ids: [context.id]
            }
          end

          before do
            allow(DatasetService).to receive(:upload).and_return(
              '57e875e4-902d-42c2-885a-8cba93adca59'
            )

            dataset.id = '57e875e4-902d-42c2-885a-8cba93adca59'

            put :update, params: {
              id: 'context',
              site_slug: site.slug,
              dataset: valid_site_info
            }
          end

          it 'set context_ids' do
            expect(@controller.view_assigns['context_ids']).to eql(
              [context.id.to_s]
            )
          end

          it 'creates relations between datasets and contexts' do
            expect(ContextDataset.where(
              context_id: context.id,
              dataset_id: dataset.id
            ).any?).to eql true
          end

          it 'redirect user to datasets list' do
            expect(response).to redirect_to(
              management_site_datasets_path(
                site_slug: site.slug
              )
            )
          end
        end

        context 'when we use invalid information' do
          let(:invalid_site_info) do
            {
              name: 'name',
              context_ids: nil
            }
          end

          before do
            put :update, params: {
              id: 'context',
              site_slug: site.slug,
              dataset: invalid_site_info
            }
          end

          it 'dont redirect user to datasets list' do
            expect(response).not_to redirect_to(
              management_site_datasets_path(
                site_slug: site.slug
              )
            )
          end

          it 'set user_contexts and dataset_context' do
            expect(@controller.view_assigns['user_contexts'].to_a).to match_array(
              site.contexts.to_a
            )
            expect(@controller.view_assigns['dataset_context']).to eql []
          end
        end
      end
    end
  end

  context 'Not signed in' do
    describe 'New site' do
      subject { get :show, params: {site_slug: site.slug, id: 'title'} }

      it do
        expect(subject).to redirect_to(
          "#{ENV['CONTROL_TOWER_URL']}/auth?callbackUrl=#{auth_login_url}&token=true"
        )
      end
    end
  end
end
