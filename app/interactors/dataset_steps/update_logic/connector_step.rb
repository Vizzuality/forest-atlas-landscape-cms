module DatasetSteps
  module UpdateLogic
    class ConnectorStep
      include Interactor

      def call
        return unless context.params[:csv_uploader]

        upload_csv(context.params, context.dataset)

        set_current_dataset_state(
          context.action_name,
          context.dataset,
          context.dataset_id,
          context.session
        )
      end

      def upload_csv(params, dataset)
        csv = params[:csv_uploader]

        dir = Rails.root.join('public', 'uploads')
        Dir.mkdir(dir) unless Dir.exist?(dir)

        filename = Time.now.to_i.to_s + csv.original_filename

        File.open(dir.join(filename), 'wb') do |file|
          file.write(csv.read)
        end
        dataset.connector_url = ENV['FA_PUBLIC_FOLDER'] + '/uploads/' + filename
      rescue
        dataset.errors.add(:connector_url, 'Error creating the file')
      end

      def set_current_dataset_state(action_name, dataset, dataset_id, session)
        return if action_name == 'show'

        if session[:dataset_creation][dataset_id]
          session[:dataset_creation][dataset_id] =
            session[:dataset_creation][dataset_id].
            deep_merge(dataset.attributes)
        else
          session[:dataset_creation][dataset_id] = dataset.attributes
        end

        dataset.set_attributes session[:dataset_creation][dataset_id]
      end
    end
  end
end
