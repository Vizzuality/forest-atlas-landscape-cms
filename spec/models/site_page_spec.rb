require 'rails_helper'

RSpec.describe SitePage, type: :model do
  context 'validation errors' do
    s = FactoryBot.create(:site_with_routes)

    describe 'duplicated url' do
      FactoryBot.create(:site_page, site: s, uri: 'test', url: '/test')
      subject { FactoryBot.build(:site_page, site: s, uri: 'test', url: '/test')}
      it { is_expected.to have(1).errors_on(:uri)}
      it { is_expected.to have(1).errors_on(:url)}
    end

    describe 'empty site id' do
      subject { FactoryBot.build(:site_page, site: nil) }
      it { is_expected.to have(1).errors_on(:site) }
    end

    describe 'cheat with position on create' do
      parent = FactoryBot.create(:site_page, site: s, parent_id: nil)
      p1 = FactoryBot.create(:site_page, site: s, position: 1, parent_id: parent.id)
      FactoryBot.create(:site_page, site: s, position: 1, parent_id: parent.id)

      it { expect(p1.reload.position).to eql(2)}
    end

    describe 'cheat with position on edit' do
      parent = FactoryBot.create(:site_page, site: s, parent_id: nil)
      p2 = FactoryBot.create(:site_page, site: s, position: 1, parent_id: parent.id)
      p1 = FactoryBot.create(:site_page, site:s, position: 2, parent_id: parent.id)
      p2.update(position: 2)
      it { expect(p1.reload.position).to eql(1)}
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
