require 'rails_helper'

RSpec.describe Site, type: :model do
  template = FactoryBot.create(:site_template_fa)
  describe 'is valid' do
    subject { FactoryBot.build(:site_with_routes, site_template: template) }
    it { is_expected.to be_valid }
  end

  describe 'has pages' do
    subject {FactoryBot.create(:site_with_routes, site_template: template) }
    it { expect(subject).to have(4).site_pages }
    it { is_expected.to be_valid }
  end

  describe 'has settings' do
    subject { FactoryBot.build(:site_with_routes, :with_settings, site_template: template) }
    it { expect(subject).to have(12).site_settings }
    it { is_expected.to be_valid }
  end

  describe 'has routes' do
    subject { FactoryBot.build(:site_with_routes, site_template: template) }
    it { expect(subject).to have(1).routes }
    it { is_expected.to be_valid }
  end

  context 'Missing fields' do
    describe 'missing routes' do
      subject { FactoryBot.build(:site, site_template: template) }
      it { is_expected.to have(1).errors_on(:routes) }
    end

    describe 'missing name' do
      subject { FactoryBot.build(:site_with_routes, name: nil)}
      it { expect(subject).to have(1).errors_on(:name) }
    end

    describe 'missing template' do
      subject { FactoryBot.build(:site, site_template: nil) }
      it { expect(subject).to have(1).errors_on(:site_template_id) }
    end

    describe 'missing context' do
      site = FactoryBot.create(:site_with_routes)
      site.context_sites = []
      it { expect(site).to have(1).errors_on(:context_sites) }
    end
  end

  context 'Performs tasks' do
    describe 'generates slug' do
      site = FactoryBot.build(:site)
      it { expect(site.slug).to eql(site.name.parameterize) }
    end

    describe 'creates default context' do
      subject { FactoryBot.create(:site_with_routes) }
      it { expect(subject.contexts.count).to eql(1) }
    end
  end
end
