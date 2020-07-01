module DatasetSteps
  class RecoverDataset
    include Interactor

    def call
      build_current_dataset_state(
        context.action_name,
        context.session,
        context.params,
        context.dataset_params,
        context.token
      )
    end

    def build_current_dataset_state(action_name, session, params, dataset_params, token)
      ds_params, dataset, dataset_id =
        build_new_dataset_state(params, dataset_params)

      if params[:dataset_id]
        dataset_id, dataset =
          build_existing_dataset_state(action_name, dataset, session, params, token)

        ds_params = dataset.attributes
      end

      # Update the dataset with the attributes saved on the session
      unless session[:dataset_creation][dataset_id].blank?
        dataset.set_attributes(
          session[:dataset_creation][dataset_id].symbolize_keys
        )
      end

      unless dataset.application
        dataset.application = (ENV['API_APPLICATIONS'] || 'forest-atlas')
      end

      process_metadata(ds_params)

      dataset.assign_attributes ds_params.except(:name, :tags, :context_ids, :metadata)
      dataset.legend = {} unless dataset.legend
      dataset.metadata = {} unless dataset.metadata

      context.dataset = dataset
      context.dataset_id = dataset_id
      context.dataset_params = ds_params
    end

    def build_new_dataset_state(params, dataset_params)
      ds_params = params[:dataset] ? dataset_params : {}

      dataset = Dataset.new
      dataset.attributes = {attributes: ds_params.to_h} if ds_params

      dataset_id = if dataset&.persisted?
                     params[:dataset_id] || dataset.id
                   else
                     params[:dataset_id] || :new
                   end

      return ds_params, dataset, dataset_id
    end

    def build_existing_dataset_state(action_name, dataset, session, params, token)
      dataset_id = params[:dataset_id] || dataset.id
      if params[:dataset]
        dataset.set_attributes(
          params.to_unsafe_h['dataset'].to_h.deep_symbolize_keys
        )
      else
        dataset = Dataset.find_with_metadata(params[:dataset_id], token)
      end
      dataset.id = dataset_id

      set_current_dataset_state(action_name, dataset, dataset_id, session)

      return dataset_id, dataset
    end

    def set_current_dataset_state(action_name, dataset, dataset_id, session)
      return if action_name == 'show'
      dataset_attributes = dataset.attributes.reject {|_,v| v.blank?}
      if session[:dataset_creation][dataset_id]
        session[:dataset_creation][dataset_id] =
          session[:dataset_creation][dataset_id].deep_merge(dataset_attributes)
      else
        session[:dataset_creation][dataset_id] = dataset_attributes
      end

      dataset.set_attributes session[:dataset_creation][dataset_id]
    end

    def process_metadata(ds_params)
      (ds_params[:metadata] || {}).each do |language, _info|
        ds_params[:metadata][language]['language'] = language
        if ds_params[:metadata][language]['id'].blank?
          ds_params[:metadata][language].delete('id')
        end
      end
    end
  end
end
