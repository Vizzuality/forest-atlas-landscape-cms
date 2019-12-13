require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe SiteSteps::UsersStepUpdateLogic do
  include SpecTestHelper

  describe '#save_button_logic' do
    let(:user) { FactoryBot.create(:user) }
    let(:site) { FactoryBot.create(:site_with_name) }
    let(:site_attributes) do
      {
        user_site_associations_attributes: {
          '0': {user_id: user.id, role: '3', selected: '1'}
        }
      }
    end

    context 'when site information is valid' do
      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UsersStepUpdateLogic.call(
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
      let(:user) { FactoryBot.create(:user, admin: false) }
      let!(:another_user) { FactoryBot.create(:user, admin: false) }
      let(:site_attributes) do
        {
          name: nil,
          user_site_associations_attributes: {
            '0': {user_id: user.id, role: nil, selected: '1'}
          }
        }
      end

      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UsersStepUpdateLogic.call(
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

      it 'build an usersite association for non admin users' do
        site = context.site

        user_site_associations = site.user_site_associations
        expect(user_site_associations.size).to eql 2
        expect(user_site_associations.last.user_id).to eql(
          another_user.id
        )
      end
    end
  end

  describe '#continue_button_logic' do
    let(:user) { FactoryBot.create(:user) }
    let(:site) { FactoryBot.create(:site_with_name) }

    context 'when site information is valid' do
      let(:site_attributes) do
        {
          user_site_associations_attributes: {
            '0': {user_id: user.id, role: '3', selected: '1'}
          }
        }
      end
      
      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UsersStepUpdateLogic.call(
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

      it 'mark form_step as name' do
        site = context.site
        expect(site.form_step).to eql 'users'
      end
    end

    context 'when site information is invalid' do
      let(:user) { FactoryBot.create(:user, admin: false) }
      let!(:another_user) { FactoryBot.create(:user, admin: false) }
      let(:site_attributes) do
        {
          name: nil,
          user_site_associations_attributes: {
            '0': {user_id: user.id, role: nil, selected: '1'}
          }
        }
      end

      subject(:context) do
        site.assign_attributes site_attributes

        SiteSteps::UsersStepUpdateLogic.call(
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

      it 'build an usersite association for non admin users' do
        site = context.site

        user_site_associations = site.user_site_associations
        expect(user_site_associations.size).to eql 2
        expect(user_site_associations.last.user_id).to eql(
          another_user.id
        )
      end
    end
  end
end
