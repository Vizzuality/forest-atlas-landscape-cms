def create_pages_templates
  home = PageTemplate.create!(
    {
      name: 'Homepage',
      description: 'Homepage description',
      uri: '',
      content_type: ContentType::HOMEPAGE,
      site_templates: [@fa_template, @la_template]
    }
  )

  PageTemplate.create!(
    {
      name: 'Map',
      description: 'Explore the map',
      content: {settings: File.read(Dir.pwd + '/lib/tasks/map_config.json')},
      uri: 'map',
      parent: home,
      content_type: ContentType::MAP,
      site_templates: [@fa_template, @la_template]
    }
  )

  PageTemplate.create!(
    {
      name: 'Data',
      description: 'Download the data',
      content: {url: 'http://cmr-data.forest-atlas.org/'},
      uri: 'data',
      parent: home,
      content_type: ContentType::LINK,
      site_templates: [@fa_template, @la_template]
    }
  )
  news = PageTemplate.create!(
    {
      name: 'News',
      description: 'View the latest news',
      uri: 'news',
      parent: home,
      content_type: ContentType::OPEN_CONTENT,
      site_templates: [@fa_template, @la_template],
      content: {body: '<p>News</p>'}
    }
  )
  news_section_1 = PageTemplate.create!(
    {
      name: 'News section 1',
      description: 'News section #1',
      uri: 'news-section-1',
      parent: news,
      content_type: ContentType::OPEN_CONTENT,
      site_templates: [@fa_template, @la_template],
      content: {body: '<p>News section 1</p>'}
    }
  )
  PageTemplate.create!(
    {
      name: 'News section 2',
      description: 'News section #2',
      uri: 'news-section-2',
      parent: news,
      content_type: ContentType::OPEN_CONTENT,
      site_templates: [@fa_template, @la_template],
      content: {body: '<p>News section 2</p>'}
    }
  )
  PageTemplate.create!(
    {
      name: 'News section 3',
      description: 'News section #3',
      uri: 'news-section-3',
      parent: news,
      content_type: ContentType::OPEN_CONTENT,
      site_templates: [@fa_template, @la_template],
      content: {body: '<p>News section 3</p>'}
    }
  )
  PageTemplate.create!(
    {
      name: 'News section 4',
      description: 'News section #4',
      uri: 'news-section-4',
      parent: news,
      content_type: ContentType::OPEN_CONTENT,
      site_templates: [@fa_template, @la_template],
      content: {body: '<p>News section 4</p>'}
    }
  )
  PageTemplate.create!(
    {
      name: 'News section 5',
      description: 'News section #5',
      uri: 'news-section-5',
      parent: news,
      content_type: ContentType::OPEN_CONTENT,
      site_templates: [@fa_template, @la_template],
      content: {body: '<p>News section 5</p>'}
    }
  )
  PageTemplate.create!(
    {
      name: 'News 1',
      description: 'News topic #1',
      uri: 'news-1',
      parent: news_section_1,
      content_type: ContentType::OPEN_CONTENT,
      site_templates: [@fa_template, @la_template]
    }
  )
  PageTemplate.create!(
    {
      name: 'News 2',
      description: 'News topic #2',
      uri: 'news-2',
      parent: news_section_1,
      content_type: ContentType::OPEN_CONTENT,
      site_templates: [@fa_template, @la_template]
    }
  )
  PageTemplate.create!(
    {
      name: 'News 3',
      description: 'News topic #3',
      uri: 'news-3',
      parent: news_section_1,
      content_type: ContentType::OPEN_CONTENT,
      site_templates: [@fa_template, @la_template]
    }
  )
  PageTemplate.create!(
    {
      name: 'News 4',
      description: 'News topic #4',
      uri: 'news-4',
      parent: news_section_1,
      content_type: ContentType::OPEN_CONTENT,
      site_templates: [@fa_template, @la_template]
    }
  )
  PageTemplate.create!(
    {
      name: 'News 5',
      description: 'News topic #5',
      uri: 'news-5',
      parent: news_section_1,
      content_type: ContentType::OPEN_CONTENT,
      site_templates: [@fa_template, @la_template]
    }
  )
  PageTemplate.create!(
    {
      name: 'News 6',
      description: 'News topic #6',
      uri: 'news-6',
      parent: news_section_1,
      content_type: ContentType::OPEN_CONTENT,
      site_templates: [@fa_template, @la_template]
    }
  )
  PageTemplate.create!(
    {
      name: 'Terms and privacy',
      description: 'Terms and privacy',
      uri: 'terms-and-privacy',
      parent: home,
      content_type: ContentType::STATIC_CONTENT,
      site_templates: [@fa_template, @la_template],
      content: {body: '<p>Terms and privacy</p>'}
    }
  )
  puts 'Template pages created successfully'
end

def create_sites
  @staging_demo_site = Site.create!({name: 'Heroku staging for FA LSA CMS', site_template: @fa_template})
  @site_two = Site.create!({name: 'Site Two', site_template: @fa_template})
  @site_three = Site.create!({name: 'Site Three', site_template: @la_template})
  @site_four = Site.create!({name: 'Site Four', site_template: @la_template})
  @base_site = Site.create!({name: 'Base site', site_template: @fa_template})
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
  @tiago_garcia_user = User.create(
    {
      email: 'tiago.garcia@vizzuality.com',
    }
  )
  @tiago_santos_user = User.create(
    {
      email: 'tiago.santos@vizzuality.com',
    }
  )
  @clement_prodhomme_user = User.create(
    {
      email: 'clement.prodhomme@vizzuality.com',
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
        user: @tiago_garcia_user,
        site: @base_site
      }, {
        user: @tiago_garcia_user,
        site: @site_two
      }, {
        user: @tiago_garcia_user,
        site: @site_three
      }, {
        user: @tiago_garcia_user,
        site: @site_four
      }, {
        user: @tiago_santos_user,
        site: @staging_demo_site
      }, {
        user: @tiago_santos_user,
        site: @site_two
      }, {
        user: @tiago_santos_user,
        site: @site_three
      }, {
        user: @tiago_santos_user,
        site: @site_four
      }, {
        user: @clement_prodhomme_user,
        site: @site_two
      }, {
        user: @clement_prodhomme_user,
        site: @site_three
      }, {
        user: @clement_prodhomme_user,
        site: @site_four
      }
    ]

    # Create user site associations
    UserSiteAssociation.create(user_sites)
    puts 'User-Site associations created successfully'
  end

end
