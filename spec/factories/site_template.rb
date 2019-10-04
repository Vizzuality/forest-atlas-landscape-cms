FactoryBot.define do
  factory :site_template_fa, class: 'SiteTemplate' do
    name { 'Forest Atlas' }

    after(:build) do |st|
      p1 = FactoryBot.build(:page_template_homepage)
      p2 = FactoryBot.build(:page_template_map, parent: p1)
      p3 = FactoryBot.build(:page_template_terms_of_service, parent: p1)
      p4 = FactoryBot.build(:page_template_privacy_policy, parent: p1)
      st.pages << [p1, p2, p3, p4]
    end
  end
end
