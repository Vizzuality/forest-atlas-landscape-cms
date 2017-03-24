class UpdateTermsPageTemplate < ActiveRecord::Migration[5.0]
  def up
    template = File.read('lib/assets/terms_template.json')
    terms_templates = PageTemplate.where(uri: 'terms-and-privacy').each do |pt|
       pt.content = {json: template}
       pt.name = 'Terms of Service'
       pt.save!
    end
  end

  def down
    # noop
  end
end
