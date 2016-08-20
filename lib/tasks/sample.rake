def create_pages_templates
  home = PageTemplate.create!(
    {
      name: 'Homepage',
      description: 'Homepage description',
      uri: '',
      site: @base_site,
      content_type: ContentType::HOMEPAGE,
      site_templates: [@fa_template, @la_template]
    }
  )

  PageTemplate.create!(
    {
      name: 'Map',
      description: 'Explore the map',
      uri: 'map',
      site: @base_site,
      parent: home,
      content_type: ContentType::MAP,
      site_templates: [@fa_template, @la_template]
    }
  )

  PageTemplate.create!(
    {
      name: 'Data',
      description: 'Download the data',
      content: 'http://cmr-data.forest-atlas.org/',
      uri: 'data',
      site: @base_site,
      parent: home,
      content_type: ContentType::LINK,
      site_templates: [@fa_template, @la_template]
    }
  )
  PageTemplate.create!(
    {
      name: 'Tutorials',
      description: 'View the tutorials',
      uri: 'subsection-1',
      site: @base_site,
      parent: home,
      content_type: ContentType::OPEN_CONTENT,
      site_templates: [@fa_template, @la_template]
    }
  )
  puts 'Template pages created successfully'
end

def create_sites
  @staging_demo_site = Site.create({name: 'Heroku staging for FA LSA CMS', site_template: @fa_template})
  @site_two = Site.create({name: 'Site Two', site_template: @fa_template})
  @site_three = Site.create({name: 'Site Three', site_template: @la_template})
  @site_four = Site.create({name: 'Site Four', site_template: @la_template})
  @base_site = Site.create({name: 'Base site', site_template: @fa_template})
  puts 'Base site created successfully'
end

def clear
  Site.delete_all
  Page.delete_all
  Route.delete_all
  User.delete_all

  puts 'Database clear'
end

def create_base_site_routes
  routes = [
    {
      host: 'localhost',
      site: @base_site
    }, {
      host: 'localhost:3000',
      site: @base_site
    }, {
      host: '0.0.0.0',
      site: @base_site
    }
  ]

  Route.create(routes)
  puts 'Routes for base site created successfully'
end

def create_heroku_staging_site_routes
  routes = [
    {
      host: 'fa-cms.herokuapp.com',
      site: @staging_demo_site
    }
  ]

  Route.create(routes)
  puts 'Routes for staging site created successfully'
end

def create_users
  @user_admin = User.create(
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password',
      password_confirmation: 'password',
      admin: true
    }
  )
  @user_manager = User.create(
    {
      name: 'Manager User',
      email: 'manager@example.com',
      password: 'password',
      password_confirmation: 'password',
      admin: false
    }
  )

  @user_one = User.create(
    {
      name: 'Test User One',
      email: 'test-user-one@example.com',
      password: 'password',
      password_confirmation: 'password'
    }
  )
  @user_two = User.create(
    {
      name: 'Test User Two',
      email: 'test-user-two@example.com',
      password: 'password',
      password_confirmation: 'password'
    }
  )
  @user_three = User.create(
    {
      name: 'Test User Three',
      email: 'test-user-three@example.com',
      password: 'password',
      password_confirmation: 'password'
    }
  )
  @user_four = User.create(
    {
      name: 'Test User Four',
      email: 'test-user-four@example.com',
      password: 'password',
      password_confirmation: 'password'
    }
  )
  puts 'Users created successfully'
end

namespace :db do
  desc 'Create sample development data'
  task :sample => :environment do

    clear

    @fa_template = SiteTemplate.find_by name: 'Forest Atlas'
    @la_template = SiteTemplate.find_by name: 'Landscape Application'

    create_pages_templates
    create_sites
    create_base_site_routes
    create_heroku_staging_site_routes
    create_users

    user_sites = [
      {
        user: @user_admin,
        site: @base_site
      }, {
        user: @user_admin,
        site: @site_two
      }, {
        user: @user_admin,
        site: @site_three
      }, {
        user: @user_admin,
        site: @site_four
      }, {
        user: @user_one,
        site: @staging_demo_site
      }, {
        user: @user_one,
        site: @site_two
      }, {
        user: @user_one,
        site: @site_three
      }, {
        user: @user_one,
        site: @site_four
      }, {
        user: @user_two,
        site: @site_two
      }, {
        user: @user_two,
        site: @site_three
      }, {
        user: @user_two,
        site: @site_four
      }, {
        user: @user_three,
        site: @site_three
      }, {
        user: @user_three,
        site: @site_four
      }, {
        user: @user_four,
        site: @site_four
      },
    ]

    # Create user site associations
    UserSiteAssociation.create(user_sites)
    puts 'User-Site associations created successfully'
  end

end
