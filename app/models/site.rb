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
  has_many :user_site_associations, dependent: :destroy
  has_many :users, through: :user_site_associations
  has_many :site_managers, -> {manager}, class_name: 'UserSiteAssociation'
  has_many :managers, source: :user, through: :site_managers
  has_many :site_publishers, -> {publisher}, class_name: 'UserSiteAssociation'
  has_many :publishers, source: :user, through: :site_publishers
  has_many :context_sites,  dependent: :destroy
  has_many :contexts, through: :context_sites
  has_many :site_settings, dependent: :destroy, inverse_of: :site

  accepts_nested_attributes_for :site_settings
  accepts_nested_attributes_for :users
  accepts_nested_attributes_for :managers
  accepts_nested_attributes_for :publishers
  accepts_nested_attributes_for :routes, reject_if: proc {|r| r['host'].blank?}

  validates_presence_of :name, if: -> { required_for_step? :name }
  validates_presence_of :routes, if: -> { required_for_step? :name }
  # TODO Check if we still need managers/publishers
  #validates_presence_of :managers, if: -> { required_for_step? :managers }
  #validates_presence_of :publishers, if: -> { required_for_step? :publishers }
  validates_presence_of :site_template_id, if: -> { required_for_step? :style }

  before_validation :generate_slug
  after_create :create_context
  after_save :update_routes
  after_create :create_template_content

  cattr_accessor :form_steps do
    { pages: %w[name managers publishers style settings finish],
      names: ['Name', 'Managers', 'Publishers', 'Style', 'Settings', 'Finish'] }
  end
  #cattr_accessor :form_steps do
  #  { pages: %w[name managers publishers contexts default_context style settings finish],
  #    names: ['Name', 'Managers', 'Publishers', 'Contexts', 'Default Contexts', 'Style', 'Settings', 'Finish'] }
  #end


  attr_accessor :form_step

  def required_for_step?(step)
    # All fields are required if no form step is present
    return true if form_step.nil?

    # All fields from previous steps are required if the
    # step parameter appears before or we are on the current step
    return true if self.form_steps[:pages].index(step.to_s) <= self.form_steps[:pages].index(form_step)
  end

  def update_routes
    DynamicRouter.update_routes_for_site self
  end

  def create_template_content
    SiteCreator.create_site_content self
  end

  def create_context
    return nil unless self.contexts.empty?

    #context = Context.new({name: self.name})
    #context.sites << self
    #context.save!


    context = Context.new({name: self.name})
    context.save!(validate: false)
    #context = Context.create!({name: self.name})
    self.context_sites.create(context_id: context.id, is_site_default_context: true)
  end

  def root
    SitePage.find_by site_id: self.id, uri: ''
  end

  # Gets the datasets available for a site
  def get_datasets
    datasets = []
    self.contexts.each{|c| c.context_datasets.each{|d| datasets << d.dataset_id}}
    datasets.uniq!
  end

  # returns an array of contexts, each with an array of their datasets
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

  # Returns an array of datasets with an array of contexts they belong to
  def get_datasets_contexts
    all_datasets = DatasetService.get_datasets
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


  private

  def generate_slug
    write_attribute(:slug, self.name.parameterize)
  end
end
