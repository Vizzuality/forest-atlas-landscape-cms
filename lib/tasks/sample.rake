namespace :db do
  desc 'Create sample development data'
  task :sample => :environment do

    Site.delete_all
    Page.delete_all
    Route.delete_all
    User.delete_all

    fa_template = SiteTemplate.find_by name: 'Forest Atlas'
    la_template = SiteTemplate.find_by name: 'Landscape Application'

    site_one = Site.create({name: 'Site One', site_template: fa_template})
    site_two = Site.create({name: 'Site Two', site_template: fa_template})
    site_three = Site.create({name: 'Site Three', site_template: la_template})
    site_four = Site.create({name: 'Site Four', site_template: la_template})

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

    home = Page.create!({name: 'Home', description: 'Homepage description', uri: '', site: base_site, page_type: PageType::HOMEPAGE})
    Page.create!({name: 'Test', description: 'Test page description', uri: 'test', site: base_site, parent: home, page_type: PageType::OPEN_CONTENT})
    section_1 = Page.create!({name: 'Section 1', description: 'Section 1 description', uri: 'section-1', site: base_site, parent: home, page_type: PageType::OPEN_CONTENT})
    Page.create!({name: 'Subsection 1', description: 'Subsection 1 description', uri: 'subsection-1', site: base_site, parent: section_1, page_type: PageType::OPEN_CONTENT})
    puts 'Pages created successfully'

    # Create users
    user_admin = User.create(
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password',
        password_confirmation: 'password'
      }
    )

    user_one = User.create(
      {
        name: 'Test User One',
        email: 'test-user-one@example.com',
        password: 'password',
        password_confirmation: 'password'
      }
    )
    user_two = User.create(
      {
        name: 'Test User Two',
        email: 'test-user-two@example.com',
        password: 'password',
        password_confirmation: 'password'
      }
    )
    user_three = User.create(
      {
        name: 'Test User Three',
        email: 'test-user-three@example.com',
        password: 'password',
        password_confirmation: 'password'
      }
    )
    user_four = User.create(
      {
        name: 'Test User Four',
        email: 'test-user-four@example.com',
        password: 'password',
        password_confirmation: 'password'
      }
    )
    puts 'Users created successfully'

    user_sites = [
      {
        user: user_admin,
        site: base_site
      }, {
        user: user_admin,
        site: site_two
      }, {
        user: user_admin,
        site: site_three
      }, {
        user: user_admin,
        site: site_four
      }, {
        user: user_one,
        site: site_one
      }, {
        user: user_one,
        site: site_two
      }, {
        user: user_one,
        site: site_three
      }, {
        user: user_one,
        site: site_four
      }, {
        user: user_two,
        site: site_two
      }, {
        user: user_two,
        site: site_three
      }, {
        user: user_two,
        site: site_four
      }, {
        user: user_three,
        site: site_three
      }, {
        user: user_three,
        site: site_four
      }, {
        user: user_four,
        site: site_four
      },
    ]

    # Create user site associations
    UserSiteAssociation.create(user_sites)
    puts 'User-Site associations created successfully'
  end
end
