require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe SiteSteps::RecoverSite do
  include SpecTestHelper

  describe '#call' do
    let(:site_attributes) do
      FactoryBot.attributes_for(:site_with_name)
    end

    subject(:context) do
      SiteSteps::RecoverSite.call(
        step: 'name',
        site_id: :new,
        session: {site: {new: site_attributes}},
        params: {site: {name: 'new name'}},
        site_params: {name: 'new name'}
      )
    end

    it 'succeeds' do
      expect(context).to be_a_success
    end
  end

  describe '#current_site' do
    let(:site_attributes) do
      FactoryBot.attributes_for(:site_with_name)
    end

    subject(:context) do
      SiteSteps::RecoverSite.call(
        step: 'name',
        site_id: :new,
        session: {site: {new: site_attributes}},
        params: {site: {name: 'new name'}},
        site_params: {name: 'new name'}
      )
    end

    it 'provides the updated site' do
      expect(context.site).not_to eql nil
    end

    it 'provides the updated session' do
      expect(context.session[:site][:new][:name]).to eql 'new name'
    end
  end

  describe '#set_template_id' do
    let(:site_attributes) do
      FactoryBot.attributes_for(:site_with_name)
    end

    subject(:context) do
      SiteSteps::RecoverSite.call(
        step: 'template',
        site_id: :new,
        session: {site: {new: site_attributes}},
        params: {site: {site_template_id: 1}},
        site_params: {site_template_id: 1}
      )
    end

    it 'updates site_template_id' do
      expect(context.session[:site][:new][:site_template_id]).to eql 1
    end
  end

  describe '#set_context_sites_attributes' do
    let(:site) { FactoryBot.create(:site_with_name) }
    let(:cont) { FactoryBot.create(:context, sites: [site]) }
    let(:site_attributes) { FactoryBot.attributes_for(:site_with_name) }
    let(:context_site) do
      FactoryBot.create(
        :context_site,
        site: site,
        context: cont,
        is_site_default_context: false
      )
    end
    let(:attributes) do
      {
        default_context: '1',
        context_sites_attributes: {
          '0' => {context_id: cont.id},
          '1' => {context_site_id: context_site.id, context_id: nil}
        }
      }
    end

    subject(:context) do
      SiteSteps::RecoverSite.call(
        step: 'contexts',
        site_id: :new,
        session: {site: {
          default_context: '1',
          new: site_attributes
        }},
        params: {site: attributes},
        site_params: attributes
      )
    end

    it 'removes context sites without context' do
      site_session = context.session[:site][:new]
      expect(site_session[:context_sites_attributes]['1']['_destroy']).to eql true
    end

    it 'set default context' do
      site_session = context.session[:site][:new]
      expect(site_session[:context_sites_attributes]['1']['is_site_default_context']).to eql 'true'
    end
  end

  describe '#set_user_site_associations_attributes' do
    let(:user1) { FactoryBot.create(:user) }
    let(:user2) { FactoryBot.create(:user) }
    let(:site) { FactoryBot.create(:site_with_users) }
    let(:site_attributes) { FactoryBot.attributes_for(:site_with_users) }
    let(:attributes) do
      {
        user_site_associations_attributes: {
          '0': {user_id: user1.id, role: '3', 'selected': '1'},
          '1': {user_id: user2.id, role: '3', 'selected': '0'}
        }
      }
    end

    subject(:context) do
      SiteSteps::RecoverSite.call(
        step: 'users',
        site_id: :new,
        session: {site: {new: site_attributes}},
        params: {site: attributes},
        site_params: attributes
      )
    end

    it 'removes non selected user associations' do
      site_session = context.session[:site][:new]
      expect(site_session[:user_site_associations_attributes][:'1']['_destroy']).to eql true
    end
  end

  describe '#set_site_settings_attributes' do
    let(:site) { FactoryBot.create(:site_with_style) }
    let(:site_attributes) do
      FactoryBot.attributes_for(:site_with_contexts).merge(
        'site_settings_attributes' => {
          '0' => FactoryBot.attributes_for(:site_setting_color)
        }
      )
    end
    let(:attributes) do
      {
        'site_settings_attributes' => {
          '0' => {position: 7, name: 'color', value: '#444444'}
        }
      }
    end

    subject(:context) do
      SiteSteps::RecoverSite.call(
        step: 'settings',
        site_id: :new,
        session: {site: {new: site_attributes}},
        params: {site: attributes},
        site_params: attributes
      )
    end

    it 'add site settings to the existing on the site' do
      site_session = context.session[:site][:new]
      expect(site_session['site_settings_attributes']['0'][:name]).to eql 'color'
      expect(site_session['site_settings_attributes']['0'][:value]).to eql '#444444'
    end
  end
end
