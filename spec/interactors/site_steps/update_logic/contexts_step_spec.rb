require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe SiteSteps::UpdateLogic::ContextsStep do
  include SpecTestHelper

  describe '#save_button_logic' do
    let_it_be(:site) { FactoryBot.create(:site_with_name) }

    context 'when site information is valid' do
      let(:cont) { FactoryBot.create(:context) }
      let(:site_attributes) do
        {context_sites_attributes: {'0': {context_id: cont.id}}}
      end

      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UpdateLogic::ContextsStep.call(
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
    end

    context 'when site information is invalid' do
      let(:site_attributes) do
        {context_sites_attributes: {'0': {context_id: '100000'}}}
      end

      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UpdateLogic::ContextsStep.call(
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

      it 'returns contexts' do
        expect(context.contexts.to_a).to eql Context.all.to_a
      end
    end
  end

  describe '#continue_button_logic' do
    let_it_be(:site) { FactoryBot.create(:site_with_name) }

    context 'when site information is valid' do
      let(:cont) { FactoryBot.create(:context) }
      let(:site_attributes) do
        {context_sites_attributes: {'0': {context_id: cont.id}}}
      end

      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UpdateLogic::ContextsStep.call(
          save_button: false,
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

      it 'mark form_step as contexts' do
        site = context.site
        expect(site.form_step).to eql 'contexts'
      end
    end

    context 'when site information is invalid' do
      let(:site_attributes) do
        {context_sites_attributes: {'0': {context_id: '10000'}}}
      end

      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UpdateLogic::ContextsStep.call(
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

      it 'returns contexts' do
        expect(context.contexts.to_a).to eql Context.all.to_a
      end
    end
  end
end
