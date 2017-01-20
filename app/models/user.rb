# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  name                   :string
#  admin                  :boolean          default(FALSE)
#

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  has_many :user_site_associations
  has_many :sites, through: :user_site_associations

  has_many :context_users
  has_many :contexts, through: :context_users

  accepts_nested_attributes_for :context_users
  accepts_nested_attributes_for :user_site_associations

  validates_uniqueness_of :name, :email
  validate :step_validation



  cattr_accessor :form_steps do
    { pages: %w[identity role sites contexts],
      names: %w[Identity Role Sites Contexts] }
  end
  attr_accessor :form_step

  def send_to_api(token, url)
    role = self.admin ? 'ADMIN' : 'MANAGER'
    UserService.create(token, self.email, role, url)
  end

  # TODO: Should we have a way to list all the datasets of the users?
  # Params
  # +status+:: The status of the datasets to get
  def get_datasets(status = 'active')
    all_datasets = DatasetService.get_datasets status
    dataset_ids = []

    # TODO: This should use user.get_contexts
    self.contexts.each do |context|
      context.context_datasets.each {|cd| dataset_ids << cd.dataset_id}
    end
    dataset_ids.uniq!

    all_datasets.select {|ds| dataset_ids.include?(ds.id)}
  end

  def get_contexts(readable: false)
    if self.admin
      return Context.all
    end

    contexts = self.contexts
    self.sites.each{|s| s.contexts.each{|c| contexts << c}} if readable
    contexts.uniq!
  end

  private
  def step_validation
    # Added to insure all validations are run if there's no step
    form_step = 'contexts' unless form_step
    step_index = form_steps[:pages].index(form_step)

    if self.form_steps[:pages].index('identity') <= step_index
      if self.name.blank?
        self.errors['name'] << 'You must choose a name for the user'
      elsif !/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.match(self.name)
        self.errors['name'] << 'The name you chose is not valid'
      elsif self.name.length > 60
        self.errors['name'] << 'Please selected a shorter name'
      end
      if self.email.blank?
        self.errors['email'] << 'Email can\'t be blank'
      elsif !/\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i.match(self.email)
        self.errors['email'] << 'Email is not valid'
      end
    end
    if self.form_steps[:pages].index('role') <= step_index
      self.errors['admin'] << 'You must select a user role' unless [true, false].include?(self.admin)
    end
  end
end
