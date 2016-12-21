class Dataset

  # The Model is a mixin for Naming, Translation, Validations and Conversions
  include ActiveModel::Model
  include ActiveModel::Serialization
  include ActiveModel::Associations

  has_many :context_datasets

  CONNECTOR_TYPES = %w[document json rest]
  CONNECTOR_PROVIDERS = %w[csv rwjson cartodb featureservice]

  cattr_accessor :form_steps do
    { pages: %w[title connector context],
      names: %w[Place Connector Context] }
  end
  attr_accessor :form_step

  validate :step_validation


  def initialize(data = {})
    self.attributes = data unless data == {}
  end

  def attributes=(data)
    return unless data && (data[:attributes] || data['attributes'])
    data.symbolize_keys!
    data[:attributes].symbolize_keys!
    @id = data[:id]
    @name = data[:attributes][:name]
    @application = data[:attributes][:application]
    @subtitle = data[:attributes][:subtitle]
    @metadata = data[:attributes][:metadata]
    @data_path = data[:attributes][:data_path]
    @attributes_path = data[:attributes][:attributes_path]
    @provider = data[:attributes][:provider]
    @format = data[:attributes][:format]
    @layers = data[:attributes][:layers]
    @connector_url = data[:attributes][:connector_url]
    @table_name = data[:attributes][:table_name]
    @tags = data[:attributes][:tags]
    @data_overwrite = data[:attributes][:data_overwrite]
    @connector = data[:attributes][:connector]
    @type = data[:attributes][:type]
  end

  def set_attributes(data)
    return unless data.is_a? Hash
    @id = data[:id]
    @name = data[:name]
    @application = data[:application]
    @subtitle = data[:subtitle]
    @metadata = data[:metadata]
    @data_path = data[:data_path]
    @attributes_path = data[:attributes_path]
    @provider = data[:provider]
    @format = data[:format]
    @layers = data[:layers]
    @connector_url = data[:connector_url]
    @table_name = data[:table_name]
    @tags = data[:tags]
    @data_overwrite = data[:data_overwrite]
    @connector = data[:connector]
    @type = data[:type]
  end

  def attributes
    {
      id: @id,
      name: @name,
      application: @application,
      subtitle: @subtitle,
      metadata: @metadata,
      data_path: @data_path,
      attributes_path: @attributes_path,
      provider: @provider,
      format: @format,
      layers: @layers,
      connector_url: @connector_url,
      table_name: @table_name,
      tags: @tags,
      data_overwrite: @data_overwrite,
      connector: @connector,
      type: @type
    }
  end


  attr_accessor :id, :application, :name, :subtitle, :metadata, :data_path,
                :attributes_path, :provider, :format, :layers, :connector_url,
                :table_name, :tags, :data_overwrite, :connector, :provider, :type


  # Uploads the dataset to the API
  # Params:
  # +token+:: The authentication for the API
  def upload(token)
    DatasetService.upload token, type, provider, connector_url,
                          application, name, tags
  end


  private
  # Validates the dataset according to the current step
  def step_validation
    step_index = form_steps[:pages].index(form_step)

    if self.form_steps[:pages].index('title') <= step_index
      self.errors['name'] << 'You must enter a name for the dataset' if self.name.blank? || self.name.strip.blank?
    end

    if self.form_steps[:pages].index('connector') <= step_index
      self.errors['type'] << 'You must enter a connector type' unless CONNECTOR_TYPES.include? self.type
      self.errors['provider'] << 'You must enter a connector provider' unless CONNECTOR_PROVIDERS.include? self.provider
      self.errors['connector_url'] << 'You must enter a valid url' unless self.connector_url unless self.connector_url && valid_url?(self.connector_url)
    end

  end

  # Returns the validity of a URL
  def valid_url?(url)
    uri = URI.parse(url)
    uri.kind_of?(URI::HTTP)
  rescue URI::InvalidURIError
    false
  end

end
