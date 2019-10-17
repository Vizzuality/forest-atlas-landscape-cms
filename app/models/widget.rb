class Widget

  # The Model is a mixin for Naming, Translation, Validations and Conversions
  include ActiveModel::Model
  include ActiveModel::Serialization
  include ActiveModel::Associations

  #before_destroy :prevent_destroy_if_dependent_pages_present

  belongs_to :dataset
  has_many :page_widgets
  #has_many :pages, through: :page_widgets


  DEFAULT_WIDGET = { application: 'forest-atlas',
                     info: { caption: '' },
                     language: 'en' }.freeze

  attr_accessor :id, :user_id, :application, :slug, :name, :description,
                :source, :source_url, :layer_id, :dataset, :authors, :query_url,
                :widget_config, :metadata, :template, :default, :protected, :status,
                :published, :freeze, :verified


  def initialize(data = {})
    self.attributes = data unless data == {}
  end

  def attributes=(data)
    return unless data && (data[:attributes] || data['attributes'])
    data.symbolize_keys!
    data[:attributes].symbolize_keys!
    @id = data[:id]
    @user_id = data[:attributes][:user_id]
    @application = data[:attributes][:application]
    @slug = data[:attributes][:slug]
    @name = data[:attributes][:name]
    @description = data[:attributes][:description]
    @source = data[:attributes][:source]
    @source_url = data[:attributes][:source_url]
    @layer_id = data[:attributes][:layer_id]
    @dataset = data[:attributes][:dataset]
    @authors = data[:attributes][:authors]
    @query_sql = data[:attributes][:query_sql]
    @widget_config = data[:attributes][:widgetConfig]
    @metadata = data[:attributes][:metadata]
    @template = data[:attributes][:template]
    @default = data[:attributes][:default]
    @protected = data[:attributes][:protected]
    @status = data[:attributes][:status]
    @published = data[:attributes][:published]
    @freeze = data[:attributes][:freeze]
    @verified = data[:attributes][:verified]
  end

  def set_attributes(data)
    return if data.try(:keys).nil?
    @id = data[:id]
    @user_id = data[:user_id]
    @application = data[:application]
    @slug = data[:slug]
    @name = data[:name]
    @description = data[:description]
    @source = data[:source]
    @source_url = data[:source_url]
    @layer_id = data[:layer_id]
    @dataset = data[:dataset]
    @authors = data[:authors]
    @query_sql = data[:query_sql]
    @widget_config = data[:widgetConfig]
    @metadata = data[:metadata]
    @template = data[:template]
    @default = data[:default]
    @protected = data[:protected]
    @status = data[:status]
    @published = data[:published]
    @freeze = data[:freeze]
    @verified = data[:verified]
  end


  def attributes
    {
      id: @id,
      user_id: @user_id,
      application: @application,
      slug: @slug,
      name: @name,
      description: @description,
      source: @source,
      source_url: @source_url,
      layer_id: @layer_id,
      dataset: @dataset,
      authors: @authors,
      query_sql: @query_sql,
      widgetConfig: @widget_config,
      metadata: @metadata,
      template: @template,
      default: @default,
      protected: @protected,
      status: @status,
      published: @published,
      freeze: @freeze,
      verified: @verified
    }
  end



  # TODO check if we can save this information in metadata (widget config)

  # Returns an array of visible columns
  # def get_columns_visible
  #   if columns
  #     return JSON.parse columns
  #   else
  #     return []
  #   end
  # end

  # Sets the columns visible as JSON
  # def set_columns_visible(value)
  #   self.write_attribute :columns, value.to_json
  # end

  # Sets the filters as JSON
  # def set_filters(value)
  #   valid = []
  #   value.each do |filter|
  #     if (!filter['name'].blank? && !filter['to'].blank? && !filter['from'].blank?)
  #       valid << filter
  #     elsif (filter['name'] && filter['values'])
  #       filter['values'] = JSON.parse(filter['values'])
  #       valid << filter
  #     end
  #   end
  #   self.write_attribute :filters, valid.to_json
  # end

  # Returns the SELECT part of the sql query (the visible fields)
  # def get_columns_visible_sql
  #   if self.columns.blank?
  #     return ' * '
  #   else
  #     return (JSON.parse self.columns).join(', ')
  #   end
  # end


  # Gets this dataset filtered
  # Params
  # +count+:: When true, it performs a count
  # def get_filtered_dataset(count = false, limit = 10000)
  #   selector = if count
  #                ' count(*) '
  #              else
  #                get_columns_visible_sql
  #              end
  #
  #   query = "select #{selector}"
  #   query += " from #{self.api_table_name}"
  #   query += ' where ' + get_filters_sql unless self.filters.blank? || JSON.parse(self.filters).blank?
  #   query += " limit #{limit}" if limit and not count
  #
  #   DatasetService.get_filtered_dataset self.dataset_id, query
  # end

  # Returns the WHERE part of the sql query (the filters)
  # def get_filters_sql
  #   if self.filters.blank?
  #     return ''
  #   else
  #     conditions = JSON.parse self.filters
  #     sql_array = []
  #     conditions.each do |condition|
  #       if condition['values']
  #         values = condition['values'].map{|x| "'#{x}'"}.join(',')
  #         sql_array << " #{condition['name']} in (#{values})"
  #       else
  #         sql_array << " #{condition['name']} between #{condition['from']} and #{condition['to']}"
  #       end
  #     end
  #     sql_array.join(' AND ')
  #   end
  # end



  # Gets the number of rows for a query
  # def get_row_count
  #   result = get_filtered_dataset true
  #
  #   if result['data'].is_a?(Array) && result['data'].first.is_a?(Hash)
  #     result['data'].first.values.first
  #   elsif result['data'].is_a?(Array)
  #     result['data'].first
  #   elsif result['data'].is_a?(Hash)
  #     result['data'].values.first
  #   else
  #     Rails.logger.debug 'Widget.get_row_count - Expected hash or array, got ' + result.inspect
  #     0
  #   end
  # end

  # Gets a preview of the results
  # def get_preview
  #   get_filtered_dataset false, 10
  # end



  # Gets the fields of this dataset
  def get_fields
    DatasetService.get_fields self.dataset_id, self.api_table_name
  end



  private
  # def prevent_destroy_if_dependent_pages_present
  #   if pages.any?
  #     msg = self.id
  #     self.errors.add(:base, msg)
  #     throw(:abort)
  #   end
  # end
end
