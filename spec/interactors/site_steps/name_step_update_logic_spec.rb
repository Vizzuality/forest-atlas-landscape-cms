require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe SiteSteps::NameStepUpdateLogic do
  include SpecTestHelper

  describe '#save_button_logic' do
    let(:site) do
      site = FactoryBot.create(:site_with_name)
      FactoryBot.create(:route, host: 'tobedeleted', site: site, main: false)
      FactoryBot.create(:route, host: 'nottobedeleted', site: site, main: false)
      site
    end
    let(:site_attributes) do
      route = Route.find_by(host: 'nottobedeleted')
      {
        'routes_attributes' => {
          '0' => {id: route.id, host: 'www.newhost.com'},
          '1' => {host: 'http://www.test.com', main: false}
        }
      }
    end

    context 'when site information is valid' do
      subject(:context) do
        site.reload
        site.assign_attributes site_attributes

        SiteSteps::NameStepUpdateLogic.call(
          save_button: true,
          site: site,
          site_id: site.id,
          session: {site: {site.id => site_attributes}},
          params: {site: site_attributes},
          site_params: site_attributes
        )
      end

      it 'success' do
        expect(context).to be_a_success
      end

      it 'mark routes for destruction' do
        routes = context.site.routes
        expect(routes.size).to eql 2
        expect(routes.map(&:host)).not_to include('tobedeleted')
      end

      it 'mark the first routes as the main route' do
        expect(site.routes.first.main).to eql true
      end
    end

    context 'when site information is invalid' do
      let(:site_attributes) do
        site.routes.first.update_attributes(main: true)

        {
          'routes_attributes' => {
            '0' => {host: 'www.newhost.com', main: true}
          }
        }
      end

      subject(:context) do
        site.reload
        site.assign_attributes site_attributes

        SiteSteps::NameStepUpdateLogic.call(
          save_button: true,
          site: site,
          site_id: site.id,
          session: {site: {site.id => site_attributes}},
          params: {site: site_attributes},
          site_params: site_attributes
        )
      end

      it 'fails' do
        expect(context).to be_a_failure
      end
    end
  end

  describe '#continue_button_logic' do
    let(:site) do
      site = FactoryBot.create(:site_with_name)
      FactoryBot.create(:route, host: 'tobedeleted', site: site, main: false)
      site
    end
    let(:site_attributes) do
      {
        'routes_attributes' => {
          '0' => {host: 'http://www.test.com', 'main' => false}
        }
      }
    end

    context 'when site information is valid' do
      subject(:context) do
        site.reload
        site.assign_attributes site_attributes

        SiteSteps::NameStepUpdateLogic.call(
          save_button: false,
          site: site,
          site_id: site.id,
          session: {site: {site.id => site_attributes}},
          params: {'site' => site_attributes},
          site_params: site_attributes
        )
      end

      it 'success' do
        expect(context).to be_a_success
      end

      it 'mark form_step as name' do
        site = context.site
        expect(site.form_step).to eql 'name'
      end

      it 'mark the first routes as the main route' do
        expect(context.params['site']['routes_attributes']['0']['main']).to eql true
      end
    end

    context 'when site information is invalid' do
      let(:site_attributes) do
        site.routes.first.update_attributes(main: true)
        {
          'routes_attributes' => {
            '0' => {host: 'www.newhost.com', main: true}
          }
        }
      end

      subject(:context) do
        site.reload
        site.assign_attributes site_attributes

        SiteSteps::NameStepUpdateLogic.call(
          save_button: false,
          site: site,
          site_id: site.id,
          session: {site: {site.id => site_attributes}},
          params: {site: site_attributes},
          site_params: site_attributes
        )
      end

      it 'fails' do
        expect(context).to be_a_failure
      end
    end
  end
end
