# == Schema Information
#
# Table name: sites
#
#  id               :integer          not null, primary key
#  site_template_id :integer
#  name             :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  slug             :text
#

class Site < ApplicationRecord
  belongs_to :site_template, optional: :true
  has_many :routes,  dependent: :destroy
  has_many :site_pages, dependent: :destroy
  has_many :user_site_associations, dependent: :destroy, autosave: true
  has_many :users, through: :user_site_associations
  has_many :site_admins, -> { admin }, class_name: 'UserSiteAssociation'
  has_many :admins, source: :user, through: :site_admins
  has_many :site_publishers, -> { publisher }, class_name: 'UserSiteAssociation'
  has_many :publishers, source: :user, through: :site_publishers
  has_many :context_sites, dependent: :destroy, inverse_of: :site
  has_many :contexts, through: :context_sites
  has_many :site_settings, dependent: :destroy, inverse_of: :site, autosave: true

  accepts_nested_attributes_for :site_settings, allow_destroy: true
  accepts_nested_attributes_for :context_sites, allow_destroy: true
  accepts_nested_attributes_for :user_site_associations, allow_destroy: true
  accepts_nested_attributes_for :admins
  accepts_nested_attributes_for :publishers
  accepts_nested_attributes_for :routes, reject_if: proc {|r| r['host'].blank?}

  validates_presence_of :name, if: -> { required_for_step? :name }
  validates_presence_of :routes, if: -> { required_for_step? :name }
  validates_presence_of :site_template_id, if: -> { required_for_step? :template }

  validate :edition_has_one_context

  before_validation :generate_slug
  before_save :create_default_context
  before_save :update_default_context
  after_create :create_context
  after_create :handle_non_compliant_slugs
  after_save :update_routes
  after_save :apply_settings
  after_create :create_template_content

  cattr_accessor :form_steps do
    { pages: %w[name users contexts settings template style content],
      names: %w(Name Users Contexts Settings Template Style Content)}
  end


  attr_accessor :form_step

  def required_for_step?(step)
    # All fields are required if no form step is present
    return true if form_step.nil?

    # All fields from previous steps are required if the
    # step parameter appears before or we are on the current step
    return true if self.form_steps[:pages].index(step.to_s) <= self.form_steps[:pages].index(form_step)
  end

  def mark_routes_for_destruction(routes_attributes)
    keep_routes_ids = routes_attributes &&
      routes_attributes.values.reject{ |r| r[:id].blank? }.map{ |r| r[:id].to_i }
    routes.each do |r|
      r.mark_for_destruction if r.persisted? && !keep_routes_ids&.include?(r.id)
    end
  end

  def update_routes
    DynamicRouter.update_routes_for_site self
  end

  def create_template_content
    SiteCreator.create_site_content self
  end

  def create_context
    return nil unless self.contexts.empty?

    context = Context.new({name: self.name})
    context.save!(validate: false)
    #context = Context.create!({name: self.name})
    self.context_sites.create(context_id: context.id, is_site_default_context: true)
  end

  def handle_non_compliant_slugs
    return unless self.slug.blank?

    update_attribute(:slug, self.id)
  end

  def root
    SitePage.find_by site_id: self.id, uri: ''
  end

  # Gets the datasets available for a site
  def get_datasets_ids(user = nil)
    datasets = []
    if user && !user.admin
      contexts = []
      self.contexts.each do |c|
        contexts << c if c.users.pluck(:user_id).include?(user.id)
      end
    else
      contexts = self.contexts
    end

    contexts.each{ |c| c.context_datasets.each{|d| datasets << d.dataset_id} }
    datasets.uniq!
    datasets
  end

  # Gets the datasets for this sites' contexts
  def get_datasets(user = nil)
    ids = get_datasets_ids(user)
    meta = DatasetService.get_metadata_list(ids)
    datasets = []
    begin
      meta['data'].each do |ds|
        datasets << Dataset.new(ds)
      end
      return datasets
    rescue
      return []
    end
  end

  # returns an array of contexts, each with an array of their datasets
  # TODO: This can now be refactored to get only the datasets of the context using ...
  # TODO: ... DatasetService.get_metadata_list(id_list)
  def get_context_datasets
    all_datasets = DatasetService.get_datasets
    context_datasets_ids = {}
    context_datasets = {}

    self.contexts.each do |context|
      context_datasets_ids[context.id] = []
      context.context_datasets.each {|cd| context_datasets_ids[context.id] << cd.dataset_id}
    end

    context_datasets_ids.each do |k, v|
      context_datasets[k] =all_datasets.select {|ds| v.include?(ds.id)}
    end

    context_datasets
  end

  def get_vega_widgets(dataset_id = nil)
    widgets = if dataset_id.nil?
                WidgetService.get_widgets
              else
                WidgetService.from_datasets(dataset_id)
              end
    vega_widgets = []
    widgets.each { |w| vega_widgets << w if w.widget_config&.dig('paramsConfig', 'visualizationType') == 'chart' }
    vega_widgets
  end

  def get_vega_datasets(widgets)
    dataset_ids = []
    widgets.each { |w| dataset_ids << w.dataset }
    dataset_ids.uniq!
    get_datasets_contexts do
      DatasetService.get_datasets(dataset_ids: dataset_ids.join(','))
    end
  end

  def get_all_datasets_contexts
    get_datasets_contexts do
      DatasetService.get_datasets
    end
  end

  # Returns an array of datasets with an array of contexts they belong to
  def get_datasets_contexts
    all_datasets = if block_given?
                     yield
                   else # Default method
                     DatasetService.get_datasets
                   end
    datasets_contexts = {}

    self.contexts.each do |context|
      context.context_datasets.each do |cd|
        dataset = all_datasets.select {|ds| ds.id == cd.dataset_id}.first
        if dataset
          unless datasets_contexts["#{cd.dataset_id}"]
            datasets_contexts["#{cd.dataset_id}"] = {dataset: dataset, contexts: []}
          end
          datasets_contexts["#{cd.dataset_id}"][:contexts] << context.name
        end
      end
    end
    datasets_contexts
  end


  # Compiles the site's css and creates a file with it
  def compile_css
    begin
      Rails.logger.debug "Compiling assets for site #{self.id}"
      compiled = compile_scss
      Rails.logger.debug "Finished compiling assets for site #{self.id}"

      folder = Rails.root + 'public/stylesheets/front/sites'
      FileUtils.mkdir_p(folder) unless File.directory?(folder)
      File.open(folder + "#{id}.css", 'w+') do |f|
        f.write(compiled)
      end
      Rails.logger.debug "Finished saving the assets for site #{self.id}"
    rescue Exception => e
        Rails.logger.error("Error compiling the css for site #{self.id}: #{e.inspect} -- #{e.backtrace}")
    end
  end

  def build_user_site_associations_for_users(users)
    user_site_associations.each do |usa|
      usa.selected = true
    end
    all_users = users.map(&:id)
    current_users = user_site_associations.map(&:user_id)
    missing_users = all_users - current_users
    missing_users.each do |user_id|
      user_site_associations.build(user_id: user_id, role: UserType::PUBLISHER, selected: false)
    end
  end

  # triggered when hosting organization changed
  def update_terms_of_service_page(page_template=nil)
    page_template ||= PageTemplate.find_by_uri(PageTemplate::TERMS_OF_SERVICE_SLUG)
    return false unless page_template.present?
    site_pages.where(uri: PageTemplate::TERMS_OF_SERVICE_SLUG).update_all(
      content: page_template.render_terms_of_service_template(self)
    )
  end

  def pages_for_sitemap
    root.self_and_descendants.where('content_type <> ?', ContentType::LINK).
      reject{ |page| !page.visible? }
  end

  private

  def generate_slug
    write_attribute(:slug, self.name.parameterize == '' ? self.id : self.name.parameterize)
  end

  def apply_settings
    #compile_css

    system "rake site:apply_settings[#{self.id}] &"

    #Thread.new {
    #  Rake.application.invoke_task("site:apply_settings[#{@site.id}]")
    #}.join
  end

  ###################################################
  # Methods to compile the css                      #
  ###################################################

  def variables
    color = self.site_settings.find_by(name: 'color')
    content_width = self.site_settings.find_by(name: 'content_width')
    content_font = self.site_settings.find_by(name: 'content_font')
    heading_font = self.site_settings.find_by(name: 'heading_font')
    cover_size = self.site_settings.find_by(name: 'cover_size')
    cover_text_alignment = self.site_settings.find_by(name: 'cover_text_alignment')
    header_separators = self.site_settings.find_by(name: 'header_separators')
    header_background = self.site_settings.find_by(name: 'header_background')
    header_transparency = self.site_settings.find_by(name: 'header_transparency')
    footer_background = self.site_settings.find_by(name: 'footer_background')
    footer_text_color = self.site_settings.find_by(name: 'footer_text_color')
    footer_links_color = self.site_settings.find_by(name: 'footer-links-color')

    if color
      {
        'accent-color': color.value,
        'content-width': content_width.value,
        'content-font': content_font.value,
        'heading-font': heading_font.value,
        'cover-size': cover_size.value,
        'cover-text-alignment': cover_text_alignment.value,
        'header-menu-items-separator': header_separators.value,
        'header-background-color': header_background.value,
        'header-background-transparency': header_transparency.value,
        'footer-background-color': footer_background.value,
        'footer-text-color': footer_text_color.value,
        'footer-links-color': footer_links_color.value
      }
    else # Fallback color
      {
        'accent-color': '#97bd3d',
        'content-width': '1280px',
        'content-font': '\'Fira Sans\'',
        'heading-font': '\'Fira Sans\'',
        'cover-size': '250px',
        'cover-text-alignment': 'left',
        'header-menu-items-separator': 'false',
        'header-background-color': '\'dark\'',
        'header-background-transparency': '\'semi\'',
        'footer-background-color': '\'dark\'',
        'footer-text-color': '\'white\'',
        'footer-links-color': '\'accent-color\''
      }
    end
  end

  def compile_erb
    Rails.logger.debug "Compiling ERB for site #{self.id}"

    case self.site_template.name
      when 'Default'
        template = 'front/template-default.css'
      when 'INDIA'
        template = 'front/template-ind.css'
      else
        Rails.logger.error "Couldn't find template name for #{self.id}"
        return
    end


    env = Rails.application.assets


#    env = if Rails.application.config.assets.is_a?(Sprockets::Index)
#            Rails.application.config.assets.instance_variable_get('@environment')
#          else
#            Rails.application.config.assets
#          end


    body = ActionView::Base.new(
      env.paths).render({
                          partial: template,
                          locals: { variables: variables },
                          formats: :scss})

    tmp_themes_path = File.join(Rails.root, 'tmp', 'compiled_css')
    FileUtils.mkdir_p(tmp_themes_path) unless File.directory?(tmp_themes_path)
    File.open(File.join(tmp_themes_path, "#{id}.scss"), 'w') { |f| f.write(body) }

    env.find_asset(id)
  end

  def compile_scss
    scss_file = compile_erb
    Rails.logger.debug "Finished compiling ERB for site #{self.id}"

    sass_engine = Sass::Engine.new(scss_file.source, {
      syntax: :scss,
      style: Rails.env.development? ? :nested : :compressed,
      cache: false,
      read_cache: false
    })
    sass_engine.render
  end

  # Validates if the template was changed
  # TODO: (Tomas) removed this validation for now, this makes it imposible to use another template ?
  def template_not_changed
    if self.site_template_id_changed? && self.persisted?
      self.errors << 'Cannot change the template of a site'
    end
  end

  def update_default_context
    self.context_sites.each do |cs|
      if cs.changed? && cs.is_site_default_context
        self.context_sites.update_all(is_site_default_context: :false)
        cs.is_site_default_context = true
      end
    end
  end

  def create_default_context
    unless self.context_sites.any?
      context = Context.create(name: "#{self.name} Context")
      self.context_sites.build(context: context, is_site_default_context: true)
    end
  end

  def edition_has_one_context
    if self.persisted? && !self.context_sites.any?
      self.errors['context_sites'] << 'You must select at least one context when editing a site'
    end
  end

end
