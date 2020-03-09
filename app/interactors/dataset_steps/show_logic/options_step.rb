module DatasetSteps
  module ShowLogic
    class OptionsStep
      include Interactor

      def call
        get_metadata_columns(
          context.site,
          context.dataset
        )
      end

      def get_metadata_columns(site, dataset)
        default_language = SiteSetting.default_site_language(site.id).value
        data = DatasetService.get_metadata(dataset.id)['data']
        metadata = data.first['attributes']['metadata'].find do |md|
          md['attributes']['language'] == default_language
        end

        fields = DatasetService.get_fields dataset.id, data.first['tableName']

        metadata_columns = fields.map do |field|
          metadata_columns = metadata&.dig('attributes', 'columns')
          field_alias = metadata_columns&.dig(field[:name], 'alias')
          field_description = metadata_columns&.dig(field[:name], 'description')
          {name: field[:name], alias: field_alias, description: field_description}
        end

        context.set_variables = {
          default_language: default_language,
          metadata_id: metadata&.dig('id'),
          metadata_columns: metadata_columns
        }
      end
    end
  end
end
