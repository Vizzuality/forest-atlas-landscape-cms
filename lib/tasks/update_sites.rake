namespace :db do
  namespace :sites do
    desc 'Updates the template of the sites'
    task template: :environment do
      begin
        ActiveRecord::Base.transaction do
          default_template = create_default_template

          Site.all.each do |site|
            next if !site&.site_template&.name ||
              site.site_template.name == 'INDIA'

            previous_template_name =
              site.site_template.name.underscore.tr(' ', '_')
            max_position = site.site_settings.maximum(:position) || 0
            send("create_site_settings_from_#{previous_template_name}", site, max_position)

            site.update_attributes(site_template_id: default_template.id)
          end

          remove_old_templates
        end
      rescue StandardError => e
        Rails.logger.error "Error updating sites: #{e.inspect}"
        puts "Error updating sites: #{e.inspect}"
        raise ActiveRecord::Rollback
      end
    end
  end
end

def create_default_template
  SiteTemplate.create!(name: 'DEFAULT')
end

def create_site_settings_from_forest_atlas(site, max_position)
  {
    content_width: '1280px',
    content_font: '\'Fira Sans\'',
    heading_font: '\'Fira Sans\'',
    cover_size: '250px',
    cover_text_alignment: 'left',
    header_separators: 'false',
    header_background: '\'dark\'',
    header_transparency: '\'semi\'',
    footer_background: '\'dark\'',
    footer_text_color: '\'white\'',
    'footer-links-color': '\'accent-color\''
  }.each_with_index do |(name, value), index|
    SiteSetting.create!(
      site: site,
      name: name,
      value: value,
      position: max_position + index + 1 # Color has the first position
    )
  end
end

def create_site_settings_from_landscape_application(site, max_position)
  {
    content_width: '1280px',
    content_font: '\'Merriweather Sans\'',
    heading_font: '\'Merriweather\'',
    cover_size: '250px',
    cover_text_alignment: 'left',
    header_separators: 'false',
    header_background: '\'white\'',
    header_transparency: '\'semi\'',
    footer_background: '\'accent-color\'',
    footer_text_color: '\'white\'',
    'footer-links-color': '\'white\''
  }.each_with_index do |(name, value), index|
    SiteSetting.create!(
      site: site,
      name: name,
      value: value,
      position: max_position + index + 1 # Color has the first position
    )
  end
end

def create_site_settings_from_carpe_landscape(site, max_position)
  {
    content_width: '100%',
    content_font: '\'Roboto Condensed\'',
    heading_font: '\'Roboto Condensed\'',
    cover_size: '170px',
    cover_text_alignment: 'center',
    header_separators: 'false',
    header_background: '\'dark\'',
    header_transparency: '\'semi\'',
    footer_background: '\'dark\'',
    footer_text_color: '\'white\'',
    'footer-links-color': '\'white\''
  }.each_with_index do |(name, value), index|
    SiteSetting.create!(
      site: site,
      name: name,
      value: value,
      position: max_position + index + 1 # Color has the first position
    )
  end
end

def remove_old_templates
  SiteTemplate.where.not(name: %w[INDIA DEFAULT]).destroy_all
end
