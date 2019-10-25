def create_pages_templates
  home = PageTemplate.create!(
    {
      name: 'Homepage',
      description: 'Homepage description',
      uri: '',
      content_type: ContentType::HOMEPAGE,
      page_version: 2,
      site_templates: [@default_template],
      content: '[{"id":1532344156248,"type":"text","content":"<h1>The interactive forest atlas of Camaroon</h1><p>The Interactive forest atlas of Cameroon is a living, dynamic forest monitoring system that provides unbiased and up-to-date information on the Cameroon\'s forest sector. Built on a geographic information system (GIS) platform, the Atlas aims to strengthen forest management and land use planning by bringing information on all major land use categories onto the same standardized platform.</p><p>The underlying forest atlas database is supported and kept up-to-date by the Ministry of Water, Forests, Hunting and Fishing and the World Resources Institute (WRI), releasing new information as it becomes available via this&nbsp;<a href=\"http://52.45.163.131/#\" target=\"_blank\" style=\"color: rgb(186, 48, 33);\">mapping application</a>. Other publications are released periodically and can be found in the&nbsp;<a href=\"http://52.45.163.131/#\" target=\"_blank\" style=\"color: rgb(186, 48, 33);\">download section</a>.</p><p><br></p><p><br></p><blockquote><em>A key data challenge by integrating forest management classes with forest cover extent and change data from GFW’s near-real-time monitoring system</em></blockquote><p><br></p><p>Unless otherwise noted, Atlas data are licensed under a&nbsp;<a href=\"http://52.45.163.131/#\" target=\"_blank\" style=\"color: rgb(186, 48, 33);\">Creative Commons Attribution 4.0</a>&nbsp;International License. You are free to copy and redistribute the material in any medium or format, and to transform and build upon the material for any purpose, even commercially. You must give appropriate credit, provide a link to the license, and indicate if changes were made. When displaying and citing the data, use the appropriate credit as listed for the corresponding dataset in the download section.</p>"}]'
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
      site_templates: [@default_template]
    }
  )

  PageTemplate.create!(
    {
      name: 'Terms and privacy',
      description: 'Terms and privacy',
      uri: PageTemplate::TERMS_OF_SERVICE_SLUG,
      parent: home,
      show_on_menu: false,
      content_type: ContentType::STATIC_CONTENT,
      site_templates: [@default_template],
      content: nil # content rendered from .erb template upon site creation
    }
  )
  puts 'Template pages created successfully'
end

def create_sites

  general_site_settings = [
    {name: 'color', value: '#97bd3d', position: 1},
    {name: 'logo_image', value: '', position: 2},
    {name: 'logo_background', value: '#000000', position: 3},
    {name: 'flag', value: '#000000', position: 4}
  ]

  @staging_demo_site = Site.new({name: 'Heroku staging for FA LSA CMS', site_template: @default_template, slug: 'heroku-staging-for-fa-lsa-cms', site_settings_attributes: general_site_settings})
  @staging_demo_site.save!(validate: false)
  @site_two = Site.new({name: 'Site Two', site_template: @default_template, slug: 'site-two', site_settings_attributes: general_site_settings})
  @site_two.save!(validate: false)
  @site_three = Site.new({name: 'Site Three', site_template: @default_template, slug: 'site-three', site_settings_attributes: general_site_settings})
  @site_three.save!(validate: false)
  @site_four = Site.new({name: 'Site Four', site_template: @default_template, slug: 'site-four', site_settings_attributes: general_site_settings})
  @site_four.save!(validate: false)
  @base_site = Site.new({name: 'Base site', site_template: @default_template, slug: 'base-site', site_settings_attributes: general_site_settings})
  @base_site.save!(validate: false)
  puts 'Base site created successfully'
end

def create_routes
  create_real_routes
  create_fake_routes
end

def create_real_routes
  create_base_site_routes
  create_heroku_staging_site_routes
end

def create_fake_routes
  [@site_two, @site_three, @site_four].each_with_index do |site, i|
    routes = [
      {
        host: "http://fake-site-#{i}.com",
        site: site
      }
    ]

    Route.create(routes)
    puts "Routes for #{site.name} created successfully"
  end
end

def create_base_site_routes
  routes = [
    {
      host: 'http://localhost:3000',
      site: @base_site
    }, {
      host: 'http://localhost',
      site: @base_site
    }, {
      host: 'http://0.0.0.0',
      site: @base_site
    }
  ]

  Route.create(routes)
  puts 'Routes for base site created successfully'
end

def create_heroku_staging_site_routes
  routes = [
    {
      host: 'http://fa-cms-staging.herokuapp.com',
      site: @staging_demo_site
    }
  ]

  Route.create(routes)
  puts 'Routes for staging site created successfully'
end

def create_vizzuality_staging_site_routes
  routes = [
    {
      host: 'http://facms.vizzuality.com',
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
      name: 'Tiago Garcia',
      admin: true
    }
  )
  @tiago_santos_user = User.create(
    {
      email: 'tiago.santos@vizzuality.com',
      name: 'Tiago Santos',
      admin: true
    }
  )
  @agnieszka_figiel_user = User.create(
    {
      email: 'agnieszka.figiel@vizzuality.com',
      name: 'Agnieszka Figiel',
      admin: true
    }
  )
  @jose_angel_user = User.create(
    {
      email: 'joseangel.parreno@vizzuality.com',
      name: 'Jose Angel',
      admin: false
    }
  )
  @clara_linos_user = User.create(
    {
      email: 'clara.linos@vizzuality.com',
      name: 'Clara Linos',
      admin: false
    }
  )
  @clement_prodhomme_user = User.create(
    {
      email: 'clement.prodhomme@vizzuality.com',
      name: 'Clément Prodhomme',
      admin: true
    }
  )
  @alvaro_leal_user = User.create(
    {
      email: 'alvaro.leal@vizzuality.com',
      name: 'Alvaro Leal',
      admin: true
    }
  )
  @daniel_caso_user = User.create(
    {
      email: 'daniel.caso@vizzuality.com',
      name: 'Daniel Caso'
    }
  )
  @david_gonzalez_user = User.create(
    {
      email: 'david.gonzalez@vizzuality.com',
      name: 'David Gonzalez'
    }
  )
  @david_inga_user = User.create(
    {
      email: 'david.inga@vizzuality.com',
      name: 'David Inga'
    }
  )
  @jose_angel_user = User.create(
    {
      email: 'joseangel.parreno@gmail.com',
      name: 'José Ángel'
    }
  )
  @tomas_eriksson_user = User.create(
    {
      email: 'tomas.eriksson@vizzuality.com',
      name: 'Tomas Eriksson',
      admin: true
    }
  )

  puts 'Users created successfully'
end

def create_user_sites
  user_sites = [
    {
      user: @daniel_caso_user,
      site: @staging_demo_site,
      role: UserType::ADMIN
    }, {
      user: @daniel_caso_user,
      site: @base_site,
      role: UserType::ADMIN
    }, {
      user: @david_gonzalez_user,
      site: @base_site,
      role: UserType::ADMIN
    }, {
      user: @david_gonzalez_user,
      site: @staging_demo_site,
      role: UserType::ADMIN
    }, {
      user: @david_inga_user,
      site: @base_site,
      role: UserType::ADMIN
    }, {
      user: @david_inga_user,
      site: @staging_demo_site,
      role: UserType::ADMIN
    }, {
      user: @jose_angel_user,
      site: @base_site,
      role: UserType::ADMIN
    }, {
      user: @jose_angel_user,
      site: @staging_demo_site,
      role: UserType::ADMIN
    }, {
      user: @alvaro_leal_user,
      site: @staging_demo_site,
      role: UserType::ADMIN
    }
  ]

  # Create user site associations
  UserSiteAssociation.create(user_sites)
  puts 'User-Site associations created successfully'
end

def create_contexts
  datasets_array = [
    %w[06c44f9a-aae7-401e-874c-de13b7764959 125b181c-653a-4a27-8a5f-e507c5a7c530],
    %w[01cbf8d0-bfba-46b0-b713-20f566d980a8 0706f039-b929-453e-b154-7392123ae99e],
    %w[098b33df-6871-4e53-a5ff-b56a7d989f9a]
  ]
  datasets_array.each_with_index do |datasets, i|
    c = Context.create!(
      {
        name: "Context #{i}",
        owner_ids: [@tiago_santos_user.id, @tiago_garcia_user.id,
                    @clement_prodhomme_user.id, @daniel_caso_user.id,
                    @david_gonzalez_user.id, @david_inga_user.id, @jose_angel_user.id],
        site_ids: [@base_site.id, @staging_demo_site.id]
      })
    datasets.each{|d| c.context_datasets.build(dataset_id: d)}
    c.save
  end

  puts 'Contexts created successfully'
end

namespace :db do
  desc 'Create sample development data'
  task :sample => :environment do

    @default_template = SiteTemplate.find_by name: 'Default'

    create_sites
    create_routes
    create_vizzuality_staging_site_routes
    create_users
    create_user_sites
    create_contexts
  end

  desc 'Create new privacy policy template and pages'
  task privacy_policy: :environment do
    ActiveRecord::Base.transaction do
      site_templates = SiteTemplate.all
      pp_page = PageTemplate.new
      pp_page.attributes =
        {
          name: 'Privacy Policy',
          description: 'Privacy Policy',
          uri: PageTemplate::PRIVACY_POLICY_SLUG,
          parent: (PageTemplate.find_by name: 'Homepage'),
          show_on_menu: false,
          content_type: ContentType::STATIC_CONTENT,
          site_templates: site_templates,
          content: {json: File.read('lib/assets/privacy_policy_page.json')}
        }
      pp_page.save!

      Site.find_each do |site|
        site_page = SitePage.new
        site_page.attributes =
          {
            name: pp_page.name,
            description: pp_page.description,
            content: pp_page.content,
            uri: String.new(pp_page.uri),
            site_id: site.id,
            show_on_menu: pp_page.show_on_menu,
            content_type: pp_page.content_type,
            enabled: true,
            parent: (SitePage.find_by site_id: site.id, uri: '')
          }
        site_page.save!
        puts "Created for site: #{site.id}"
      end
    end
  end

  namespace :update do
    task privacy_policy: :environment do
      ActiveRecord::Base.transaction do
        pp_page = PageTemplate.find_by name: 'Privacy Policy'
        pp_page.content = {json: File.read('lib/assets/privacy_policy_page.json')}
        pp_page.save!

        Site.find_each do |site|
          s_page = site.site_pages.find_by name: 'Privacy Policy'
          s_page.content = pp_page.content
          s_page.save
        end
      end
    end

    task oc_template: :environment do
      ActiveRecord::Base.transaction do
        pp_page = PageTemplate.find_by name: 'Homepage'
        pp_page.content = '[{"id":1532344156248,"type":"text","content":"<h1>The interactive forest atlas of Camaroon</h1><p>The Interactive forest atlas of Cameroon is a living, dynamic forest monitoring system that provides unbiased and up-to-date information on the Cameroon\'s forest sector. Built on a geographic information system (GIS) platform, the Atlas aims to strengthen forest management and land use planning by bringing information on all major land use categories onto the same standardized platform.</p><p>The underlying forest atlas database is supported and kept up-to-date by the Ministry of Water, Forests, Hunting and Fishing and the World Resources Institute (WRI), releasing new information as it becomes available via this&nbsp;<a href=\"http://52.45.163.131/#\" target=\"_blank\" style=\"color: rgb(186, 48, 33);\">mapping application</a>. Other publications are released periodically and can be found in the&nbsp;<a href=\"http://52.45.163.131/#\" target=\"_blank\" style=\"color: rgb(186, 48, 33);\">download section</a>.</p><p><br></p><p><br></p><blockquote><em>A key data challenge by integrating forest management classes with forest cover extent and change data from GFW’s near-real-time monitoring system</em></blockquote><p><br></p><p>Unless otherwise noted, Atlas data are licensed under a&nbsp;<a href=\"http://52.45.163.131/#\" target=\"_blank\" style=\"color: rgb(186, 48, 33);\">Creative Commons Attribution 4.0</a>&nbsp;International License. You are free to copy and redistribute the material in any medium or format, and to transform and build upon the material for any purpose, even commercially. You must give appropriate credit, provide a link to the license, and indicate if changes were made. When displaying and citing the data, use the appropriate credit as listed for the corresponding dataset in the download section.</p>"}]'
        pp_page.page_version = 2
        pp_page.save!
      end
    end
  end
end
