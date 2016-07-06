namespace :db do
  desc "Create sample development data"
  task :sample => :environment do

    Site.delete_all
    Page.delete_all
    Route.delete_all
    User.delete_all

    fa_template = SiteTemplate.find_by name: 'Forest Atlas'

    base_site = Site.create({name: 'Base site', site_template: fa_template})
    puts 'Base site created successfully'

    routes = [
      {
        host: 'localhost',
        site: base_site
      }, {
        host: 'localhost:3000',
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

    users = [
      {
        email: 'admin@example.com',
        password: 'password',
        password_confirmation: 'password'
      }
    ]

    # Create users
    User.create(users)
    puts "Users created successfully"
  end
end
