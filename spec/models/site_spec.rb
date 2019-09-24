require 'rails_helper'

RSpec.describe Site, type: :model do
  template = FactoryBot.create(:site_template_fa)
  describe 'is valid' do
    subject { FactoryBot.build(:site_with_routes, site_template: template) }
    it { is_expected.to be_valid }
  end

  describe 'missing routes' do
    subject { FactoryBot.build(:site, site_template: template) }
    it { is_expected.to have(1).errors_on(:routes) }
  end

  describe 'has pages' do
    subject { FactoryBot.create(:site_with_routes, site_template: template) }
    # it { expect{subject}.to change(SitePage, :count).by(5) }
    it { expect(subject).to have(5).site_pages }
    it { is_expected.to be_valid }
  end

  describe 'has settings' do
    subject { FactoryBot.build(:site_with_routes, :with_settings, site_template: template) }
    # it { expect{subject}.to change(SiteSetting, :count).by(12) }
    it { expect(subject).to have(12).site_settings }
    it { is_expected.to be_valid }
  end
end
