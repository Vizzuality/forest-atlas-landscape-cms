# == Schema Information
#
# Table name: contexts
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Context < ApplicationRecord
  has_many :context_datasets
  has_many :dataset_settings
  has_many :context_users
  has_many :users, through: :context_users
  has_many :context_owners, -> {owner}, class_name: 'ContextUser'
  has_many :owners, source: :user, through: :context_owners
  has_many :context_writers, -> {writer}, class_name: 'ContextUser'
  has_many :writers, source: :user, through: :context_writers
  has_many :context_sites
  has_many :sites, through: :context_sites

  validate :steps_validation


  cattr_accessor :form_steps do
    { pages: %w[title sites owners writers datasets],
      names: %w[Title Sites Owners Writers Datasets] }
  end
  attr_accessor :form_step


  def is_site_default_context
    context_sites.each do |context_site|
      return true if context_site.is_site_default_context
    end
    return false
  end

  def is_dataset_default_context
    context_datasets.each do |context_dataset|
      return true if context_dataset.is_dataset_default_context
    end
    return false
  end

  private
  def steps_validation
    step_index = form_steps[:pages].index(form_step)

    if self.form_steps[:pages].index('title') <= step_index
      self.errors['name'] << 'You must enter a name for the context' if self.name.blank? || self.name.strip.blank?
    end

    if self.form_steps[:pages].index('sites') <= step_index
      self.errors['sites'] << 'You must select at least one site' if self.sites.length <= 0
    end

    # No validations for now
    if self.form_steps[:pages].index('owners') <= step_index
    end

    # No validations for now
    if self.form_steps[:pages].index('writers') <= step_index
    end

    # Not validations for now
    if self.form_steps[:pages].index('datasets') <= step_index
    end
  end
end
