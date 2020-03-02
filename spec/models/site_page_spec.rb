require 'rails_helper'

RSpec.describe SitePage, type: :model do
  let(:site) { FactoryBot.create(:site_with_routes) }

  context 'validation errors' do
    describe 'duplicated url' do
      before do
        FactoryBot.create(:site_page, site: site, uri: 'test', url: '/test')
      end

      subject do
        site_page =
          FactoryBot.build(:site_page, site: site, uri: 'test', url: '/test')
        site_page.valid?
        site_page
      end

      it { is_expected.to have(1).errors_on(:uri) }
      it { is_expected.to have(1).errors_on(:url) }
    end

    describe 'cheat with position on create' do
      before do
        parent = FactoryBot.create(:site_page, site: site, parent_id: nil)
        @p1 = FactoryBot.create(:site_page, site: site, position: 1, parent_id: parent.id)
        FactoryBot.create(:site_page, site: site, position: 1, parent_id: parent.id)
      end

      it { expect(@p1.reload.position).to eql(2) }
    end

    describe 'cheat with position on edit' do
      before do
        parent = FactoryBot.create(:site_page, site: site, parent_id: nil)
        p2 = FactoryBot.create(:site_page, site: site, position: 1, parent_id: parent.id)
        @p1 = FactoryBot.create(:site_page, site: site, position: 2, parent_id: parent.id)
        p2.update(position: 2)
      end

      it { expect(@p1.reload.position).to eql(1) }
    end
  end

  context 'page types' do
    context 'link' do
      describe 'constructs url from content' do
        subject { FactoryBot.create(:site_page, content_type: ContentType::LINK, content: { 'url': 'test.com' }) }
        it { expect(subject.content['url']).to eql('http://test.com')}
      end

      describe 'doesn\'t change content' do
        subject { FactoryBot.build(:site_page, content_type: ContentType::LINK, content: { 'url': '/test.com'})}
        it { expect(subject.content['url']).to eql ('/test.com') }
      end
    end

    context 'map' do
      describe 'update booleans' do
        subject { FactoryBot.create(:site_page, content_type: ContentType::MAP, content: { 'settings': {'a': 'true', 'b': 'false'}})}
        it { expect(subject.content['settings']['a']).to eql(true)}
        it { expect(subject.content['settings']['b']).to eql(false)}
      end
    end
  end
end
