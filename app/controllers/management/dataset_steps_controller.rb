class Management::DatasetStepsController < ManagementController
  include Wicked::Wizard
  include NavigationHelper

  before_action :ensure_management_user, only: :destroy
  before_action :set_site, only: [:new, :edit, :show, :update]
  before_action :steps_names
  before_action :setup_wizard
  prepend_before_action :build_current_dataset_state, only: [:new, :edit, :show, :update]
  prepend_before_action :ensure_session_keys_exist, only: [:new, :edit, :show, :update]

  attr_accessor :steps_names
  helper_method :disable_button?
  helper_method :active_button?

  # This action clears the session
  def new
    reset_session_key(:dataset_creation, @dataset_id, {})
    reset_session_key(:context_datasets, @dataset_id, {})
    redirect_to management_site_dataset_step_path(site_slug: params[:site_slug], id: 'title')
  end

  # This action clears the session
  def edit
    reset_session_key(:dataset_creation, @dataset_id, {})
    reset_session_key(:context_datasets, @dataset_id, {})
    @dataset = Dataset.find_with_metadata(params[:dataset_id])
    set_current_dataset_state
    redirect_to management_site_dataset_dataset_step_path(site_slug: params[:site_slug],\
      dataset_id: params[:dataset_id], id: :metadata)
  end

  # Wicked Wizard's Show
  def show
    @breadcrumbs << {name: 'New Dataset'}

    @dataset.form_step = step
    case step
      when 'title'
      when 'connector'
        gon.collector_selected = nil
      when 'labels'
      when 'context'
        select_contexts
      when 'metadata'
        get_languages
        get_metadata
      when 'options'
        get_metadata_columns
    end
    render_wizard
  end

  # Wicked Wizard's Update
  def update
    @dataset.form_step = step
    set_current_dataset_state
    case step
    when 'title', 'labels'
      if @dataset.valid?
        redirect_to next_wizard_path
      else
        render_wizard
      end
    when 'metadata'
      if @dataset.valid?
        save_or_update_step
      else
        render_wizard
      end
    when 'options'
      if @dataset.valid?
        save_or_update_step
      else
        render_wizard
      end
    when 'connector'
      if params[:csv_uploader]
        upload_csv
        set_current_dataset_state
      end
      if @dataset.valid?
        save_or_update_step
      else
        render_wizard
      end
    when 'context'
      if @dataset.valid?
        build_context_datasets
        if @context_ids.count == 0
          @dataset.errors['id'] << 'You must choose at least one context'
          select_contexts
          render_wizard
          return
        end

        ds_id = @dataset.upload session[:user_token]
        if ds_id != nil
          save_context_datasets ds_id
          delete_session_key(:dataset_creation, @dataset_id)
          redirect_to_finish_wizard
        else
          @dataset.errors['id'] <<
            'There was an error creating the dataset in the API. Please try again later.'
          select_contexts
          render_wizard
        end
      else
        render_wizard
      end
    end
  end


  private
  def dataset_params
    metadata_params = Dataset::API_PROPERTIES + Dataset::APPLICATION_PROPERTIES
    params.require(:dataset).permit(
      :name,
      :tags,
      :connector,
      :provider,
      :type,
      :connector_url,
      :data_path,
      context_ids: [],
      legend: [:lat, :long, :country, :region, :date],
      metadata: {
        es: metadata_params,
        en: metadata_params,
        fr: metadata_params,
        gr: metadata_params
      }
    )
  end

  def save_or_update_step
    if params['button'].eql?('CONTINUE')
      redirect_to next_wizard_path
      return
    end

    if @dataset.update session[:user_token]
      delete_session_key(:dataset_creation, @dataset_id)
      redirect_to_finish_wizard
    else
      @dataset.errors['id'] <<
        'There was an error creating the dataset in the API. Please try again later.'
      render_wizard
    end
  end

  def upload_csv
    begin
      csv = params[:csv_uploader]

      dir = Rails.root.join('public', 'uploads')
      Dir.mkdir(dir) unless Dir.exist?(dir)

      filename = Time.now.to_i.to_s + csv.original_filename

      File.open(dir.join(filename), 'wb') do |file|
        file.write(csv.read)
      end
      @dataset.connector_url = ENV['FA_PUBLIC_FOLDER'] + '/uploads/' + filename
    rescue
      @dataset.errors.add(:connector_url, 'Error creating the file')
    end
  end

  # Sets the current site from the url
  def set_site
    @site = Site.find_by({slug: params[:site_slug]})
  end

  def steps_names
    self.steps = @dataset.form_steps[:pages]
    self.steps_names = @dataset.form_steps[:names]
  end

  def select_contexts

    user = current_user
    @user_contexts = []
    @site.contexts.each do |c|
      if user.admin || c.owners.include?(user) || c.writers.include?(user)
        @user_contexts << c
      end
    end

    @user_contexts = @site.contexts
    @dataset_context = @dataset.id ? dataset.id : []
  end

  def build_current_dataset_state
    ds_params = build_new_dataset_state

    if params[:dataset_id]
      build_existing_dataset_state

      @dataset.metadata = params[:dataset][:metadata] if params[:dataset]

      ds_params = @dataset.attributes
    end

    # Update the dataset with the attributes saved on the session
    @dataset.set_attributes session[:dataset_creation][@dataset_id] if session[:dataset_creation][@dataset_id]

    @dataset.application = (ENV['API_APPLICATIONS'] || 'forest-atlas') unless @dataset.application

    process_metadata(ds_params)

    @dataset.assign_attributes ds_params.except(:context_ids)
    @dataset.legend = {} unless @dataset.legend
    @dataset.metadata = {} unless @dataset.metadata
  end

  def build_new_dataset_state
    ds_params = params[:dataset] ? dataset_params : {}
    @dataset = ds_params[:dataset] ? Dataset.find(ds_params[:dataset]) : Dataset.new
    @dataset_id = if @dataset && @dataset.persisted?
      params[:dataset_id] || @dataset.id
    else
      :new
    end

    ds_params
  end

  def build_existing_dataset_state
    @dataset_id = params[:dataset_id]
    @dataset = Dataset.find_with_metadata(params[:dataset_id])
    @dataset.id = @dataset_id

    if params[:dataset]
      @dataset.metadata = @dataset.metadata.deep_merge(
        params.to_unsafe_h[:dataset][:metadata].transform_keys(&:to_sym)
      )
    end

    set_current_dataset_state
  end

  def set_current_dataset_state
    if session[:dataset_creation] &&
       session[:dataset_creation][@dataset_id] &&
       session[:dataset_creation][@dataset_id]['metadata']
      @dataset.metadata =
        session[:dataset_creation][@dataset_id]['metadata'].transform_keys(&:to_sym).deep_merge(
          @dataset.metadata
        )
    end
    session[:dataset_creation][@dataset_id] = @dataset.attributes
  end

  # Creates an array of context_datasets
  def build_context_datasets
    ds_params = params[:dataset] ? dataset_params : {}
    @context_ids = ds_params[:context_ids] ?  ds_params[:context_ids] : []
  end

  # Saves the current context_datasets
  def save_context_datasets dataset_id
    @context_ids.each do |context|
      begin
        cd = ContextDataset.new dataset_id: dataset_id, context_id: context
        cd.save!
      end
    end
  end

  # Defines the path the wizard will go when finished
  def finish_wizard_path
    management_site_datasets_path params[:site_slug]
  end

  def ensure_session_keys_exist
    session[:dataset_creation] ||= {}
    session[:context_datasets] ||= {} # TODO: is this used?
  end

  def get_languages
    @languages = @dataset.get_languages
    @default_language = SiteSetting.default_site_language(@site.id).value
  end

  def get_metadata
    formatted_metadata = {}
    metadata = DatasetService.metadata_find_by_ids(session[:user_token], [@dataset.id])
    metadata.each do |metadata|
      formatted_metadata[metadata['attributes']['language']] =
        metadata['attributes']
      formatted_metadata[metadata['attributes']['language']]['id'] =
        metadata['id']
    end
    @metadata = formatted_metadata
  end

  def get_metadata_columns
    @default_language = SiteSetting.default_site_language(@site.id).value
    dataset = DatasetService.get_metadata(@dataset.id)['data']
    metadata = dataset['attributes']['metadata'].select do |md|
      md['attributes']['language'] == @default_language
    end.first
    @metadata_id = metadata&.dig('id')

    fields = DatasetService.get_fields @dataset.id, dataset['tableName']

    @metadata_columns = fields.map do |field|
      metadata_columns = metadata&.dig('attributes', 'columns')
      field_alias = metadata_columns&.dig(field[:name], 'alias')
      field_description = metadata_columns&.dig(field[:name], 'description')
      {name: field[:name], alias: field_alias, description: field_description}
    end
  end

  def process_metadata(ds_params)
    (ds_params[:metadata] || {}).each do |language, info|
      ds_params[:metadata][language]['language'] = language
      if ds_params[:metadata][language]['id'].blank?
        ds_params[:metadata][language].delete('id')
      end
    end
  end
end
