class Dataset

  # The Model is a mixin for Naming, Translation, Validations and Conversions
  include ActiveModel::Model
  include ActiveModel::Serialization
  include ActiveModel::Associations

  has_many :context_datasets

  CONNECTOR_TYPES = %w[document rest].freeze
  CONNECTOR_PROVIDERS = %w[csv json cartodb featureservice].freeze

  API_PROPERTIES = [
    :id, :language, :description, :citation, :source, :name, :application,
    :columns
  ].freeze

  APPLICATION_PROPERTIES = [
    :agol_id, :agol_link, :amazon_link, :sql_api, :carto_link, :map_service,
    :download_data, :cautions, :date_of_content, :frequency_of_updates,
    :function, :geographic_coverage, :learn_more, :other, :resolution, :subtitle
  ].freeze

  def form_steps(user_site_admin = false, own_user_dataset = false, validating = false)
    if id.nil?
      {
        pages: %w[title connector labels context],
        names: %w[Title Connector Labels Context]
      }
    elsif user_site_admin || own_user_dataset || validating
      {
        pages: %w[title connector metadata options],
        names: %w[Title Connector Metadata Aliases]
      }
    else
      {
        pages: %w[title connector],
        names: %w[Title Connector]
      }
    end
  end

  attr_accessor :id, :application, :name, :metadata, :data_path,
                :attributes_path, :provider, :format, :layers, :connector_url,
                :table_name, :tags, :data_overwrite, :connector,
                :type, :legend, :status, :user_id, :user, :created_at,
                :updated_at, :widgets, :form_step

  validate :step_validation

  def initialize(data = {})
    self.attributes = data unless data == {}
  end

  def attributes=(data)
    return unless data && (data[:attributes] || data['attributes'])
    data.symbolize_keys!
    data[:attributes] = data[:attributes].symbolize_keys
    @id = data[:id]
    @name = data[:attributes][:name]
    @application = data[:attributes][:application]
    metadata = if data[:attributes][:metadata].is_a?(Array)
                 Dataset.process_metadata(data[:attributes][:metadata])
               else
                 (data[:attributes][:metadata] || {}).symbolize_keys
               end
    @metadata = metadata
    @data_path = data[:attributes][:data_path]
    @attributes_path = data[:attributes][:attributes_path]
    @provider = data[:attributes][:provider]
    @format = data[:attributes][:format]
    @layers = data[:attributes][:layers]
    @connector_url = data[:attributes][:connectorUrl]
    @table_name = data[:attributes][:table_name]
    vocabulary = data[:attributes][:vocabulary]
    legacy = vocabulary && vocabulary.find do |v|
      v['type'] == 'vocabulary' && v['attributes'].present? && v['attributes']['name'] == 'legacy'
    end
    @tags = legacy && legacy['attributes']['tags'] || []
    @data_overwrite = data[:attributes][:data_overwrite]
    @connector = data[:attributes][:connectorType]
    @type = data[:attributes][:connectorType]
    @legend = data[:attributes][:legend]
    @status = data[:attributes][:status]
    @created_at = data[:attributes][:createdAt]
    @updated_at = data[:attributes][:updatedAt]
    @user_id = data[:attributes][:userId]
    @user = data[:attributes][:user]
    @widgets = data[:attributes][:widget]
  end

  def set_attributes(data)
    return unless data.is_a? Hash
    @id = data[:id]
    @name = data[:name]
    @application = data[:application]
    metadata = if data[:metadata].is_a?(Array)
                 Dataset.process_metadata(data[:metadata])
               else
                 (data[:metadata] || {}).symbolize_keys
               end
    @metadata = metadata
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
    @created_at = data[:created_at]
    @updated_at = data[:updated_at]
    @user_id = data[:user_id]
    @user = data[:user]
    @widgets = data[:widget]
  end

  def attributes
    {
      id: @id,
      name: @name,
      application: @application,
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
      status: @status,
      created_at: @created_at,
      updated_at: @updated_at,
      user_id: @user_id,
      user: @user,
      widgets: @widgets
    }
  end

  def connector_url=(value)
    if !@connector.eql?('arcgis') || value.include?('f=pjson')
      @connector_url = value and return
    end

    return unless value

    @connector_url = "#{value}#{value.include?('?') ? '&f=pjson' : '?f=pjson'}"
  end

  def get_metadata
    DatasetService.get_metadata id
  end

  def self.find_with_metadata(id, token = nil)
    properties = DatasetService.get_metadata(id, token)
    return nil if properties.empty? || (data = properties['data'].first).empty?
    dataset = Dataset.new
    data_attributes = data['attributes']&.symbolize_keys
    if data_attributes
      dataset.attributes = {'attributes': data_attributes.except(:metadata)}
      if data_attributes[:metadata]&.any?
        dataset.metadata = Dataset.process_metadata(data_attributes[:metadata])
      end
    end
    dataset
  end

  def self.process_metadata(metadata)
    return metadata if metadata.is_a? Hash

    metadata = metadata.select do |md|
      md['attributes']['application'] == ENV['API_APPLICATIONS'] || 'forest-atlas'
    end

    metadata_attributes = {}
    metadata.each do |md|
      next unless md['attributes']
      md_attributes = md['attributes'].symbolize_keys
      md_attributes[:id] = md['id']
      if md_attributes[:applicationProperties]
        md_attributes = md_attributes.merge(
          md_attributes[:applicationProperties].symbolize_keys
        )
      end
      metadata_attributes[md_attributes[:language]] = md_attributes
    end
    metadata_attributes
  end

  # Uploads the dataset to the API
  # Params:
  # +token+:: The authentication for the API
  def upload(token)
    tags_array = tags&.split(',') || []
    build_arcgis_metadata if provider.eql? 'featureservice'
    DatasetService.upload token, type, provider, connector_url, data_path,
                          application, name, tags_array, legend, metadata
  end

  def update(token)
    DatasetService.update token, attributes

    DatasetService.update_connector token, id, connector_url if provider.eql? 'csv'
  end

  def save_metadata(token)
    metadata.each do |language, metadata_info|
      metadata_info['language'] = language
      metadata_info.symbolize_keys!
      if metadata_info[:id].present?
        update_metadata(token, metadata_info)
      else
        create_metadata(token, metadata_info)
      end
    end
  end

  def update_metadata(token, metadata = metadata)
    tags_array = tags&.split(',') || []
    DatasetService.update_metadata(
      token, id, ENV['API_APPLICATIONS'] || 'forest-atlas', name, tags_array, metadata
    )
  end

  def create_metadata(token, metadata = metadata)
    tags_array = tags&.split(',') || []
    DatasetService.create_metadata(
      token, id, ENV['API_APPLICATIONS'] || 'forest-atlas', name, tags_array, metadata
    )
  end

  # Updates the metadata when the provider is feature service
  # It connects to the feature service and extracts the description,
  # name, and fields
  def build_arcgis_metadata
    @metadata = []
    languages.each do |language, _value|
      lang_metadata = {}
      arcgis_metadata = ArcgisService.build_metadata(connector_url)
      lang_metadata[:description] = arcgis_metadata['description']
      lang_metadata[:source] = arcgis_metadata['copyrightText']

      columns = {}
      arcgis_metadata['fields'].each { |f| columns[f['name']] = {'alias': f['alias']} }
      lang_metadata[:columns] = columns
      lang_metadata[:language] = language

      @metadata.push lang_metadata
    end
  end

  # TODO: have a feeling this does not return the metadata object
  def self.get_metadata_list(dataset_ids)
    DatasetService.get_metadata_list(dataset_ids)
  end

  def self.get_metadata_list_for_frontend(user_token, dataset_ids)
    metadata_list = DatasetService.metadata_find_by_ids(user_token, dataset_ids)
    Hash[metadata_list.map do |d|
      attributes = d['attributes'].symbolize_keys
      application_properties = attributes[:applicationProperties].try(:symbolize_keys)
      metadata = attributes.slice(*Dataset::API_PROPERTIES)
      metadata = metadata.merge(application_properties.slice(*Dataset::APPLICATION_PROPERTIES)) if application_properties.present?
      [
        attributes[:dataset],
        metadata
      ]
    end]
  end

  def self.get_metadata_for_frontend(user_token, dataset_id)
    metadata_list = Dataset.get_metadata_list_for_frontend(user_token, dataset_id)
    metadata_list[dataset_id]
  end

  def languages
    context_datasets = ContextDataset.
      where(dataset_id: @id).
      joins('INNER JOIN context_sites ON context_sites.context_id = context_datasets.context_id').
      select('context_sites.site_id')

    if context_datasets.none?
      return {
        'es' => 'Spanish',
        'en' => 'English',
        'fr' => 'French',
        'ka' => 'georgian'
      }
    end

    sites_ids = context_datasets.map(&:site_id).uniq
    sites_ids.map { |site_id| SiteSetting.languages(site_id) }.reduce({}, :merge)
  end

  private

  # Validates the dataset according to the current step
  def step_validation
    form_steps = form_steps(false, false, true)
    step_index = form_steps[:pages].index(form_step)

    title_step = form_steps[:pages].index('title')
    if title_step && title_step <= step_index
      errors['name'] << 'You must enter a name for the dataset' if name.blank? || name.strip.blank?
    end

    connector_step = form_steps[:pages].index('connector')
    if connector_step && connector_step == step_index
      unless CONNECTOR_TYPES.include? type
        errors['type'] << 'You must enter a connector type'
      end
      unless CONNECTOR_PROVIDERS.include? provider
        errors['provider'] << 'You must enter a connector provider'
      end
      unless connector_url && !connector_url.blank? && valid_url?(connector_url)
        errors['connector_url'] << 'You must enter a valid url'
      end
      if connector_url.present? && data_path.present? && !valid_xpath?(data_path)
        errors['data_path'] << 'If the JSON file is not structured as an array of objects in document root, please provide the path to data in Xpath format. Otherwise leave blank.'
      end
    end

    pages_step = form_steps[:pages].index('labels')

    return unless pages_step && pages_step <= step_index

    unless legend&.is_a?(Hash)
      errors['legend'] << 'Labels not correctly defined'
      return
    end
    if legend[:lat].blank? ^ legend[:long].blank?
      errors['legend'] << 'Latitude and Longitude have to be filled together'
    end
    if legend[:country].blank? ^ legend[:region].blank?
      errors['legend'] << 'Country and Region have to be filled together'
    end
  end

  # Returns the validity of a URL
  def valid_url?(url)
    uri = URI.parse(url)
    uri.is_a?(URI::HTTP)
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
