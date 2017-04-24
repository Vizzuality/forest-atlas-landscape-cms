class Dataset

  # The Model is a mixin for Naming, Translation, Validations and Conversions
  include ActiveModel::Model
  include ActiveModel::Serialization
  include ActiveModel::Associations

  has_many :context_datasets

  CONNECTOR_TYPES = %w[document rest]
  CONNECTOR_PROVIDERS = %w[csv json cartodb featureservice]

  APPLICATION_PROPERTIES = [
    :agol_id, :agol_link, :amazon_link, :sql_api, :carto_link, :map_service,
    :download_data, :cautions, :date_of_content, :frequency_of_updates,
    :function, :geographic_coverage, :learn_more, :other, :resolution, :subtitle
  ]

  cattr_accessor :form_steps do
    {pages: %w[title connector labels metadata context],
     names: %w[Title Connector Labels Metadata Context]}
  end
  attr_accessor :form_step

  validate :step_validation

  attr_accessor :id, :application, :name, :subtitle, :language, :description,
                :source, :metadata, :data_path, :attributes_path, :provider,
                :format, :layers, :connector_url, :table_name, :tags,
                :data_overwrite, :connector, :provider, :type, :legend, :status

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
    @language = data[:attributes][:language]
    @description = data[:attributes][:description]
    @source = data[:attributes][:source]
    @data_path = data[:attributes][:data_path]
    @attributes_path = data[:attributes][:attributes_path]
    @provider = data[:attributes][:provider]
    @format = data[:attributes][:format]
    @layers = data[:attributes][:layers]
    @connector_url = data[:attributes][:connector_url]
    @table_name = data[:attributes][:table_name]
    vocabulary = data[:attributes][:vocabulary]
    legacy = vocabulary && vocabulary.find do |v|
      v['type'] == 'vocabulary' && v['attributes'].present? && v['attributes']['name'] == 'legacy'
    end
    @tags = legacy && legacy['attributes']['tags'] || []
    @data_overwrite = data[:attributes][:data_overwrite]
    @connector = data[:attributes][:connector]
    @type = data[:attributes][:type]
    @legend = data[:attributes][:legend]
    @status = data[:attributes][:status]
  end

  def set_attributes(data)
    return unless data.is_a? Hash
    @id = data[:id]
    @name = data[:name]
    @application = data[:application]
    @subtitle = data[:subtitle]
    @metadata = data[:metadata]
    @language = data[:language]
    @description = data[:description]
    @source = data[:source]
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
    @legend = data[:legend]
    @status = data[:status]
  end

  def attributes
    {
      id: @id,
      name: @name,
      application: @application,
      subtitle: @subtitle,
      language: @language,
      description: @description,
      source: @source,
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
      type: @type,
      legend: @legend,
      status: @status
    }
  end

  def connector_url=(value)
    if (not @connector.eql? 'arcgis' or value.include? 'f=pjson')
      @connector_url = value and return
    end

    if (value.include? '?')
      @connector_url = value+'&f=pjson'
    else
      @connector_url = value+'?f=pjson'
    end
  end

  def get_metadata
    DatasetService.get_metadata self.id
  end


  # Uploads the dataset to the API
  # Params:
  # +token+:: The authentication for the API
  def upload(token)
    tags_array = tags && tags.split(',') || []
    DatasetService.upload token, type, provider, connector_url, data_path,
                          application, name, tags_array, legend, metadata
  end


  def self.get_metadata_list(dataset_ids)
    DatasetService.get_metadata_list(dataset_ids)
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
      self.errors['connector_url'] << 'You must enter a valid url' \
        unless self.connector_url && !self.connector_url.blank? && valid_url?(self.connector_url)
      if self.connector_url.present? && self.data_path.present? && !valid_xpath?(self.data_path)
        self.errors['data_path'] << 'If the JSON file is not structured as an array of objects in document root, please provide the path to data in Xpath format. Otherwise leave blank.'
      end
    end

    if self.form_steps[:pages].index('labels') <= step_index
      unless self.legend && self.legend.is_a?(Hash)
        self.errors['legend'] << 'Labels not correctly defined'
        return
      end
      self.errors['legend'] << 'Latitude and Longitude have to be filled together' if self.legend[:lat].blank? ^ self.legend[:long].blank?
      self.errors['legend'] << 'Country and Region have to be filled together' if self.legend[:country].blank? ^ self.legend[:region].blank?
    end
  end

  # Returns the validity of a URL
  def valid_url?(url)
    uri = URI.parse(url)
    uri.kind_of?(URI::HTTP)
  rescue URI::InvalidURIError
    false
  end

  def valid_xpath?(xpath)
    doc = Nokogiri::HTML('<p/>') # dummy doc just for xpath syntax check
    begin
      doc.xpath(xpath)
    rescue Nokogiri::XML::XPath::SyntaxError => e
      return false
    end
    true
  end

end
