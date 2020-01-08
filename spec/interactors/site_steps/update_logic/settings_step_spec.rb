require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe SiteSteps::UpdateLogic::SettingsStep do
  include SpecTestHelper

  describe '#process_site_settings' do
    context 'when the site is persited' do
      let(:site) { FactoryBot.create(:site_with_name) }
      let(:site_attributes) do
        site_setting = FactoryBot.create(:site_setting_color, site: site)
        {
          site_settings_attributes: {
            '0': {position: 7, name: 'translate_english', value: 1},
            '1': {
              'id' => site_setting.id.to_s,
              'position' => site_setting.position,
              'name' => site_setting.name,
              'value' => '#123321'
            }
          }
        }
      end

      subject(:context) do
        SiteSteps::UpdateLogic::SettingsStep.call(
          save_button: true,
          site: site,
          site_id: site.id,
          session: {site: {site.id => site_attributes}},
          params: {site: site_attributes},
          site_params: site_attributes
        )
      end

      it 'update existing site settings' do
        expect(context.site.site_settings.find_by(name: 'color').value).to eql(
          '#123321'
        )
      end
    end

    context 'when the site is not persisted' do
      let(:site) { FactoryBot.build(:site_with_name) }
      let(:site_attributes) do
        {
          site_settings_attributes: {
            '0': {position: 7, name: 'translate_english', value: 1}
          }
        }
      end

      subject(:context) do
        SiteSteps::UpdateLogic::SettingsStep.call(
          save_button: true,
          site: site,
          site_id: :new,
          session: {site: {new: site_attributes}},
          params: {site: site_attributes},
          site_params: site_attributes
        )
      end

      it 'build each site settings on the site' do
        site_settings = context.site.site_settings
        expect(site_settings.size).to eql(1)
        expect(site_settings.first.value).to eql '1'
      end
    end
  end

  describe '#save_button_logic' do
    let_it_be(:site) { FactoryBot.create(:site_with_name) }

    context 'when site information is valid' do
      let(:site_attributes) do
        {
          site_settings_attributes: {
            '0': {position: 7, name: 'translate_english', value: 1}
          }
        }
      end

      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UpdateLogic::SettingsStep.call(
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
        {
          site_settings_attributes: {
            '0': {position: nil, name: nil, value: 1}
          }
        }
      end

      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UpdateLogic::SettingsStep.call(
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
      let(:site_attributes) do
        {
          site_settings_attributes: {
            '0': {position: 7, name: 'translate_english', value: 1}
          }
        }
      end

      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UpdateLogic::SettingsStep.call(
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
        expect(site.form_step).to eql 'settings'
      end
    end

    context 'when site information is invalid' do
      let(:site_attributes) do
        {
          site_settings_attributes: {
            '0': {position: nil, name: nil, value: 1}
          }
        }
      end

      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UpdateLogic::SettingsStep.call(
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
