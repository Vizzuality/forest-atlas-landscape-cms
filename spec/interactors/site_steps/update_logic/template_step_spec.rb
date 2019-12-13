require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe SiteSteps::UpdateLogic::TemplateStep do
  include SpecTestHelper

  describe '#save_button_logic' do
    let_it_be(:site) { FactoryBot.create(:site_with_name) }

    context 'when site information is valid' do
      let(:site_template) { FactoryBot.create :site_template_default }
      let(:site_attributes) { {site_template_id: site_template.id} }

      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UpdateLogic::TemplateStep.call(
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
      let(:site_attributes) { {site_template_id: nil} }

      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UpdateLogic::TemplateStep.call(
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
    let_it_be(:site) { FactoryBot.create(:site_with_name) }

    context 'when site information is valid' do
      let(:site_template) { FactoryBot.create :site_template_default }
      let(:site_attributes) { {site_template_id: site_template.id} }

      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UpdateLogic::TemplateStep.call(
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

      it 'mark form_step as template' do
        site = context.site
        expect(site.form_step).to eql 'template'
      end
    end

    context 'when site information is invalid' do
      let(:site_attributes) { {site_template_id: nil} }

      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UpdateLogic::TemplateStep.call(
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
