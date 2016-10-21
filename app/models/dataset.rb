class Dataset
  extend ActiveModel::Naming
  include ActiveModel::Model
  include ActiveModel::Conversion
  include ActiveModel::Validations
  include ActiveModel::Serialization

  def initialize(data = {})
    self.attributes = data
  end

  def attributes=(data)
    @id = data['id']
    @name = data['name']
    @application = data['application']
    @subtitle = data['subtitle']
    @metadata = data['metadata']
    @data_path = data['data_path']
    @attributes_path = data['attributes_path']
    @provider = data['provider']
    @format = data['format']
    @layers = data['layers']
    @connector_url = data['connector_url']
    @table_name = data['table_name']
    @tags = data['tags']
    @data_overwrite = data['data_overwrite']
  end

  attr_accessor :id, :application, :name, :subtitle, :metadata, :data_path, :attributes_path, :provider, :format, :layers, :connector_url, :table_name, :tags, :data_overwrite

  def persisted?
    false
  end



end
