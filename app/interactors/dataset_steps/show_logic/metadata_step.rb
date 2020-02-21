module DatasetSteps
  module ShowLogic
    class MetadataStep
      include Interactor

      def call
        get_languages(context.site, context.dataset)
        get_metadata(
          context.dataset,
          context.dataset_id,
          context.session
        )
      end

      def get_languages(site, dataset)
        context.set_variables = {
          languages: dataset.get_languages,
          default_language:
            SiteSetting.default_site_language(site.id)&.value || 'fr'
        }
      end

      def get_metadata(dataset, dataset_id, session)
        formatted_metadata = {}
        metadata =
          DatasetService.metadata_find_by_ids(session[:user_token], [dataset.id])
        metadata.each do |m|
          formatted_metadata[m['attributes']['language']] = m['attributes']
          formatted_metadata[m['attributes']['language']]['id'] = m['id']
        end

        context.set_variables[:metadata] =
          formatted_metadata.merge(session[:dataset_creation][dataset_id]['metadata'])
      end
    end
  end
end
