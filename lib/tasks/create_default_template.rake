#lib/tasks/create_default_template.rake
namespace :templates do
  desc 'Creates page templates for default template'
  task :default_site_pages, [:site_id] => :environment do |t, args|
    default_template = SiteTemplate.find_by(name: 'Default')
    templates = [default_template]
    home = PageTemplate.create!(
      name: 'Homepage',
      description: 'Homepage description',
      uri: '',
      content_type: ContentType::HOMEPAGE,
      page_version: 2,
      site_templates: templates,
      position: 0,
      content: '[{"id":1532344156248,"type":"text","content":"<h1>The interactive forest atlas of Camaroon</h1><p>The Interactive forest atlas of Cameroon is a living, dynamic forest monitoring system that provides unbiased and up-to-date information on the Cameroon\'s forest sector. Built on a geographic information system (GIS) platform, the Atlas aims to strengthen forest management and land use planning by bringing information on all major land use categories onto the same standardized platform.</p><p>The underlying forest atlas database is supported and kept up-to-date by the Ministry of Water, Forests, Hunting and Fishing and the World Resources Institute (WRI), releasing new information as it becomes available via this&nbsp;<a href=\"http://52.45.163.131/#\" target=\"_blank\" style=\"color: rgb(186, 48, 33);\">mapping application</a>. Other publications are released periodically and can be found in the&nbsp;<a href=\"http://52.45.163.131/#\" target=\"_blank\" style=\"color: rgb(186, 48, 33);\">download section</a>.</p><p><br></p><p><br></p><blockquote><em>A key data challenge by integrating forest management classes with forest cover extent and change data from GFW’s near-real-time monitoring system</em></blockquote><p><br></p><p>Unless otherwise noted, Atlas data are licensed under a&nbsp;<a href=\"http://52.45.163.131/#\" target=\"_blank\" style=\"color: rgb(186, 48, 33);\">Creative Commons Attribution 4.0</a>&nbsp;International License. You are free to copy and redistribute the material in any medium or format, and to transform and build upon the material for any purpose, even commercially. You must give appropriate credit, provide a link to the license, and indicate if changes were made. When displaying and citing the data, use the appropriate credit as listed for the corresponding dataset in the download section.</p>"}]'
    )

    PageTemplate.create!(
      name: 'Map',
      description: 'Explore the map',
      content: {settings: File.read(Dir.pwd + '/lib/tasks/map_config.json')},
      uri: 'map',
      parent: home,
      content_type: ContentType::MAP,
      position: 1,
      site_templates: templates
    )

    PageTemplate.create!(
      name: 'Terms of service',
      description: 'Terms of service',
      uri: PageTemplate::TERMS_OF_SERVICE_SLUG,
      parent: home,
      show_on_menu: false,
      content_type: ContentType::STATIC_CONTENT,
      site_templates: templates,
      position: 2,
      content: nil # content rendered from .erb template upon site creation
    )

    PageTemplate.create!(
      name: 'Privacy Policy',
      description: 'Privacy Policy',
      uri: PageTemplate::PRIVACY_POLICY_SLUG,
      parent: home,
      show_on_menu: false,
      content_type: ContentType::STATIC_CONTENT,
      site_templates: templates,
      position: 3,
      content: File.read('lib/assets/privacy_policy_page.json')
    )
    puts 'Template pages created successfully'
  end

  task :recreate_site_pages_for_default_template, [:site_id] => :environment do |t, args|
    default_template = SiteTemplate.find_by(name: 'Default')

    Site.
      where(site_template_id: default_template.id).
      select { |s| s.site_pages.size.zero? }.
      each(&:create_template_content)
  end

  desc 'Updates the page templates of type MAP to the content in map_config.json'
  task update_map_pages: :environment do
    pages = PageTemplate.where(content_type: ContentType::MAP)
    pages.each do |p|
      p.content = { settings: File.read(Dir.pwd + '/lib/tasks/map_config.json') }
      p.save
    end
  end
end
