class Management::PageStepsController < ManagementController
  include Wicked::Wizard
  include TreeStructureHelper

  # The order of prepend is the opposite of its declaration
  prepend_before_action :set_steps
  prepend_before_action :build_current_page_state, only: [:show, :update, :edit, :filtered_results]
  prepend_before_action :set_site, only: [:new, :edit, :show, :update, :filtered_results]
  before_action :setup_wizard

# TODO: Authenticate user per site
# before_action :authenticate_user_for_site!, only: [:index, :new, :create]
# before_action :set_content_type_variables, only: [:new, :edit]

  helper_method :form_steps
  attr_accessor :steps_names
  attr_accessor :invalid_steps

  CONTINUE = 'CONTINUE'.freeze
  SAVE     = 'SAVE CHANGES'.freeze
  PUBLISH  = 'PUBLISH'.freeze


  # TODO : create a session for incorrect state and last step visited


  # This action cleans the session
  def new
    session[:dataset_setting] = {}
    if params[:parent]
      parent = Page.find(params[:parent])
      if parent
        position = parent.children.length
        session[:page] =  {parent_id: params[:parent], position: position}
        redirect_to management_site_page_step_path(id: 'title')
      else
        redirect_to management_site_page_step_path(id: 'position')
      end
    else
      session[:page] = {}
      redirect_to management_site_page_step_path(id: 'position')
    end
  end

  # This action cleans the session
  def edit
    session[:page] = {}
    session[:dataset_setting] = {}
    redirect_to wizard_path('position')
  end

  def show
    case step
      when 'position'
        assign_position
      when 'title'
      when 'type'
        if @page.content_type
          redirect_to wizard_path(wizard_steps[3])
          return
        end

      when 'dataset'
        @context_datasets = current_user.get_context_datasets

      when 'filters'
        build_current_dataset_setting
        @fields = @dataset_setting.get_fields
        @fields.each{ |f| f[:type] = 'number' if %w[double long].include?(f[:type])}
        gon.fields = @fields
        gon.filters_endpoint_url = wizard_path('filters') + '/filtered_results.json'

        # Saving all the possible visible fields for this dataset so that ...
        # ... they can be used in the filtered_results
        (@dataset_setting.columns_visible =
          @fields.map{|f| f[:name]}.to_json) unless @dataset_setting.columns_visible
        set_current_dataset_setting_state

      when 'columns'
        build_current_dataset_setting
        @fields = @dataset_setting.get_fields

      when 'preview'
        build_current_dataset_setting
        gon.analysis_user_filters = @dataset_setting.columns_changeable.blank? ? {} : (JSON.parse @dataset_setting.columns_changeable)
        gon.analysis_graphs = @dataset_setting.default_graphs.blank? ? {} : (JSON.parse @dataset_setting.default_graphs)
        gon.analysis_map = @dataset_setting.default_map.blank? ? {} : (JSON.parse @dataset_setting.default_map)
        gon.analysis_data = @dataset_setting.get_filtered_dataset
        gon.analysis_timestamp = @dataset_setting.fields_last_modified

      # OPEN CONTENT PATH
      when 'open_content'
      when 'open_content_preview'

      # DYNAMIC INDICATOR PATH
      when 'widget'
      when 'dynamic_indicator_dashboard'
      when 'dynamic_indicator_dashboard_preview'

      end

      @breadcrumbs = [@site.name, 'Page creation']

      render_wizard
  end

  def update
    @page.form_step = step
    case step
      when 'position'
        set_current_page_state
        move_forward

      when 'title'
        set_current_page_state
        # If the user has selected the type of page already it doesn't show the type page
        move_forward(@page.content_type ? wizard_path(wizard_steps[3]) : next_wizard_path)

      when 'type'
        set_current_page_state
        move_forward

      # ANALYSIS DASHBOARD PATH
      when 'dataset'
        build_current_dataset_setting
        set_current_dataset_setting_state
        if @page.valid?
          redirect_to next_wizard_path
        else
          @context_datasets = current_user.get_context_datasets
          render_wizard
        end

      when 'filters'
        build_current_dataset_setting
        set_current_dataset_setting_state
        move_forward

      when 'columns'
        build_current_dataset_setting
        set_current_dataset_setting_state
        move_forward

      when 'preview'
        build_current_dataset_setting
        set_current_dataset_setting_state
        @page.dataset_setting = @dataset_setting
        move_forward management_site_site_pages_path params[:site_slug]

      # OPEN CONTENT PATH
      when 'open_content'
        if save_button?
          set_current_page_state
          move_forward next_wizard_path, next_wizard_path
        else
          @page.enabled = true
          set_current_page_state
          redirect_to management_site_site_pages_path params[:site_slug]
        end

      when 'open_content_preview'
        @page.enabled = !@page.enabled
        @page.save
        redirect_to management_site_site_pages_path params[:site_slug]

      # DYNAMIC INDICATOR DASHBOARD PATH
      when 'widget'
        redirect_to next_wizard_path

      when 'dynamic_indicator_dashboard'
        redirect_to next_wizard_path
        # move_forward

      when 'dynamic_indicator_dashboard_preview'
        # TODO: When the validations are done, put this back
        # move_forward
        redirect_to management_site_site_pages_path params[:site_slug]

      # LINK PATH
      when 'link'
        move_forward management_site_site_pages_path params[:site_slug]
    end
  end

  # GET /management/sites/:slug/page_steps/:id/filtered_results
  def filtered_results
    build_current_dataset_setting
    unless @dataset_setting && @dataset_setting.dataset_id && @dataset_setting.api_table_name
      render json: {count: 0, rows: []}.to_json
      return
    end

    temp_dataset_setting =
      DatasetSetting.new(dataset_id: @dataset_setting.dataset_id,
          api_table_name: @dataset_setting.api_table_name,
          columns_visible: @dataset_setting.columns_visible)

    filters = params[:filters]
    temp_dataset_setting.set_filters (filters.blank? ? nil : filters.values)

    begin
      count = temp_dataset_setting.get_row_count['data'].first.values.first
      preview = temp_dataset_setting.get_preview['data']
    rescue
      count = 0
      preview = []
    end
    render json: {count: count, rows: preview}.to_json
  end

  private
  def page_params
    # TODO: To have different permissions for different steps
    params.require(:site_page).permit(:name, :description, :position, :uri,
                                      :parent_id, :content_type, content: [:url, :target_blank, :body, :json],
                                      dataset_setting: [:context_id_dataset_id, :filters, visible_fields: []])
  end

  # Sets the current site from the url
  def set_site
    @site = Site.find_by({slug: params[:site_slug]})
  end

  # Builds the current page state based on the database, session and params
  def build_current_page_state
    # Verify if the manager is editing a page or creating a new one
    @page = params[:site_page_id] ? SitePage.find(params[:site_page_id]) : (SitePage.new site_id: @site.id)

    # Update the page with the attributes saved on the session
    @page.assign_attributes session[:page] if session[:page]
    @page.assign_attributes page_params.to_h.except(:dataset_setting) if params[:site_page] && page_params.to_h.except(:dataset_setting)

  end

  # Saves the current page state in session
  def set_current_page_state
    session[:page] = @page
  end

  # Builds the current dataset setting based on the database, session and params
  def build_current_dataset_setting
    ds_params = {}
    ds_params = page_params.to_h[:dataset_setting] if params[:site_page] && page_params.to_h && page_params.to_h[:dataset_setting]

    @dataset_setting = nil
    if ds_params[:id]
      @dataset_setting = DatasetSetting.find(ds_params[:id])
    elsif @page.dataset_setting
      @dataset_setting = @page.dataset_setting
    else
      @dataset_setting = DatasetSetting.new
      @page.dataset_setting = @dataset_setting
    end
    @dataset_setting.assign_attributes session[:dataset_setting] if session[:dataset_setting]

    # If the user changed the id of the dataset, the entity is reset
    if ids = ds_params[:context_id_dataset_id]
      ids = ids.split(' ')
      @dataset_setting = DatasetSetting.new(context_id: ids[0], dataset_id: ids[1])
      @dataset_setting.api_table_name = @dataset_setting.get_table_name
    end

    # TODO: Refactor this to the model
    if fields = ds_params[:filters]
      fields = JSON.parse fields
      filters = []
      changeables = []
      fields.each do |field|
        name = field['name']
        from = field['from']
        to = field['to']
        (changeables << field['name']) if name && field['variable'] == 'true'
        (filters << "#{name} between #{from} and #{to}") if name && from && to
      end
      filters = filters.blank? ? '' : filters.to_json
      changeables = changeables.blank? ? '' : changeables.to_json
      @dataset_setting.assign_attributes({filters: filters, columns_changeable: changeables})
    end

    if fields = ds_params[:visible_fields]
      columns_visible = fields.to_json
      @dataset_setting.columns_visible = columns_visible
    end
  end

  # Saves the current data settings state in the session
  def set_current_dataset_setting_state
    session[:dataset_setting] = @dataset_setting
  end

  # Sets the current steps
  def set_steps
    invalid_steps = []
    unless @page && @page.content_type
      steps = { pages: %w[position title type],
                names: %w[Position Title Type] }
      self.steps = steps[:pages]
      self.steps_names = steps[:names]
    else
      steps = @page.form_steps
      self.steps = steps[:pages]
      self.steps_names = steps[:names]
      invalid_steps = ['type']
    end
    set_invalid_steps invalid_steps
  end

  # Returns the current steps
  def form_steps
    self.steps
  end

  # Sets the current list of invalid steps
  def set_invalid_steps(steps)
    self.invalid_steps = steps
  end

  # Return true if the button pressed was save
  def save_button?
    return false unless params[:button]
    return params[:button].upcase == SAVE.upcase
  end

  # Saves the current state and goes to the next step
  # Params:
  # +next_step+:: Next step on pressing continue
  # +save_step+:: Next step on pressing save
  def move_forward(next_step = next_wizard_path,
                   save_step = management_site_site_pages_path(params[:site_slug]))
    if save_button?

      if @page.save
        redirect_to save_step
      else
        render_wizard
      end

    else

      if @page.valid?
        redirect_to next_step
      else
        render_wizard
      end
    end
  end

  # Gets the pages tree structure and sends it to gon
  def assign_position
    gon.structure = build_pages_tree
    gon.position = @page.position
    gon.parent_id = @page.parent_id
  end

end
