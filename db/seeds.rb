# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

SiteTemplate.delete_all
Site.delete_all
Page.delete_all
Route.delete_all

fa_template = SiteTemplate.create({name: 'Forest Atlas'})
la_template = SiteTemplate.create({name: 'Landscape Application'})
puts 'Site templates created successfully'

base_site = Site.create({name: 'Base site', site_template: fa_template})
puts 'Base site created successfully'

routes = [
  {
    host: 'localhost',
    site: base_site
  }, {
    host: '0.0.0.0',
    site: base_site
  }
]

Route.create(routes)
puts 'Routes created successfully'

home = Page.create({name: 'Home', description: 'Homepage description', uri: '', site: base_site})
test = Page.create({name: 'Test', description: 'Test page description', uri: 'test', site: base_site, parent: home})
section_1 = Page.create({name: 'Section 1', description: 'Section 1 description', uri: 'section-1', site: base_site, parent: home})
subsection_1 = Page.create({name: 'Subsection 1', description: 'Subsection 1 description', uri: 'subsection-1', site: base_site, parent: section_1})
puts 'Pages created successfully'
