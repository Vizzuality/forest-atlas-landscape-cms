class Management::DatasetStepsController < ManagementController
  include Wicked::Wizard
  include NavigationHelper

  before_action :authenticate_user_for_site!

  before_action :set_site, only: [:new, :edit, :show, :update]
  before_action :steps_names
  before_action :build_current_dataset_state, only: [:new, :edit, :show, :update]

  steps *Dataset.form_steps[:pages]
  attr_accessor :steps_names
  helper_method :disable_button?
  helper_method :active_button?

  # This action clears the session
  def new
    session[:dataset_creation] = {}
    session[:context_datasets] = {}
    redirect_to management_site_dataset_step_path(site_slug: params[:site_slug], id: 'title')
  end

  # This action clears the session
  def edit
    session[:dataset_creation] = {}
    session[:context_datasets] = {}
    redirect_to management_site_dataset_dataset_step_path(site_slug: params[:site_slug],\
      dataset_id: params[:dataset_id], id: 'title')
  end

  # Wicked Wizard's Show
  def show
    @dataset.form_step = step
    case step
      when 'title'
      when 'connector'
        gon.collector_selected = nil
      when 'labels'
      when 'context'
        select_contexts
    end
    render_wizard
  end

  # Wicked Wizard's Update
  def update
    @dataset.form_step = step
    set_current_dataset_state
    case step
      when 'title'
        if @dataset.valid?
          redirect_to next_wizard_path
        else
          render_wizard
        end
      when 'connector'
        if @dataset.valid?
          redirect_to next_wizard_path
        else
          render_wizard
        end
      when 'labels'
        if @dataset.valid?
          redirect_to next_wizard_path
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
            redirect_to_finish_wizard
          else
            @dataset.errors['id'] <<
              'There was an error creating the Database in the API. Please try again later.'
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
    params.require(:dataset).permit(:name, :tags, :connector, :provider, :type, :connector_url,
                                    context_ids: [], legend: [:lat, :lon, :country, :region])
  end

  # Sets the current site from the url
  def set_site
    @site = Site.find_by({slug: params[:site_slug]})
  end

  def steps_names
    self.steps_names = *Dataset.form_steps[:names]
  end

  def select_contexts
    @user_contexts = current_user.contexts
    @dataset_context = @dataset.id ? dataset.id : []
  end

  def build_current_dataset_state
    ds_params = params[:dataset] ? dataset_params : {}

    # TODO: This will be for editing the datasets.
    if ds_params[:id]
    else
      @dataset = Dataset.new
      @dataset.set_attributes session[:dataset_creation]
    end
    @dataset.application = ['forest-atlas'] unless @dataset.application
    @dataset.tags = ds_params.delete(:tags)
    @dataset.assign_attributes ds_params.except(:context_ids)
    @dataset.legend = {} unless @dataset.legend
  end

  def set_current_dataset_state
    session[:dataset_creation] = @dataset.attributes
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
end
