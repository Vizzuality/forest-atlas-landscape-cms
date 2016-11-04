class Dataset

  # The Model is a mixin for Naming, Translation, Validations and Conversions
  include ActiveModel::Model
  include ActiveModel::Serialization
  include ActiveModel::Associations

  has_many :context_datasets

  def initialize(data = {})
    self.attributes = data unless data == {}
  end

  def attributes=(data)
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
  end

  attr_accessor :id, :application, :name, :subtitle, :metadata, :data_path,
                :attributes_path, :provider, :format, :layers, :connector_url,
                :table_name, :tags, :data_overwrite
end
