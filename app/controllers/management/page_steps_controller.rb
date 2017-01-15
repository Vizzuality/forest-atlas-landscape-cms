class Management::PageStepsController < ManagementController
  include Wicked::Wizard
  include TreeStructureHelper

  before_action :authenticate_user_for_site!, only: [:new, :edit, :show, :update, :filtered_results]

  # The order of prepend is the opposite of its declaration
  prepend_before_action :load_wizard
  prepend_before_action :set_steps
  prepend_before_action :build_current_page_state, only: [:show, :update, :edit, :filtered_results]
  prepend_before_action :set_site, only: [:new, :edit, :show, :update, :filtered_results]

  before_action :redirect_invalid_step

  helper_method :form_steps
  attr_accessor :steps_names
  attr_accessor :invalid_steps

  CONTINUE = 'CONTINUE'.freeze
  SAVE = 'SAVE CHANGES'.freeze
  PUBLISH = 'PUBLISH'.freeze


  # TODO : create a session for incorrect state and last step visited (?)


  # This action cleans the session
  def new
    session[:dataset_setting] = {}
    session[:invalid_steps] = %w[type title]
    if params[:parent]
      parent = Page.find(params[:parent])
      if parent
        position = parent.children.length
        session[:page] = {parent_id: params[:parent], position: position}
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
    session[:invalid_steps] = 'type'
    redirect_to wizard_path('position')
  end

  def show
    if invalid_steps.include? step
      redirect_to wizard_path(wizard_steps[0])
      return
    end

    case step
      when 'position'
        assign_position
      when 'title'
      when 'type'
      when 'dataset'
        @context_datasets = current_user.get_context_datasets

      when 'filters'
        build_current_dataset_setting
        @fields = @dataset_setting.get_fields
        @fields.each { |f| f[:type] = 'number' if %w[double long int].any? {|x| f[:type].downcase.include?(x)} }
        @fields.each { |f| f[:type] = 'date' if f[:type].downcase.include?('date')}

        gon.fields = @fields
        gon.filters_endpoint_url = wizard_path('filters') + '/filtered_results.json'

        filters = @dataset_setting.filters ? JSON.parse(@dataset_setting.filters) : []
        changeables = @dataset_setting.columns_changeable ? JSON.parse(@dataset_setting.columns_changeable) : []

        gon_filters = []
        filters.each do |filter|
          if changeables.include?(filter['name'])
            filter['variable'] = true
          else
            filter['variable'] = false
          end
          gon_filters << filter
        end
        gon.filters_array = gon_filters.blank? ? nil : gon_filters

        # Saving all the possible visible fields for this dataset so that ...
        # ... they can be used in the filtered_results
        (@dataset_setting.set_columns_visible(
          @fields.map { |f| f[:name] })) unless @dataset_setting.columns_visible
        set_current_dataset_setting_state

      when 'columns'
        build_current_dataset_setting
        @fields = @dataset_setting.get_fields

      when 'preview'
        build_current_dataset_setting
        gon.analysis_user_filters = @dataset_setting.columns_changeable.blank? ? nil : (JSON.parse @dataset_setting.columns_changeable)
        gon.analysis_graphs = @dataset_setting.default_graphs.blank? ? nil : (JSON.parse @dataset_setting.default_graphs)
        gon.analysis_map = @dataset_setting.default_map.blank? ? nil : (JSON.parse @dataset_setting.default_map)
        gon.analysis_data = @dataset_setting.get_filtered_dataset
        gon.analysis_timestamp = @dataset_setting.fields_last_modified
        gon.legend = @dataset_setting.legend

        @analysis_user_filters = @dataset_setting.columns_changeable.blank? ? [] : (JSON.parse @dataset_setting.columns_changeable)

      # OPEN CONTENT PATH
      when 'open_content'
        gon.widgets = get_widgets_list
      when 'open_content_preview'
        gon.widgets = get_widgets_list

    end

    @breadcrumbs = [
      {name: @site.name, url: url_for(controller: 'management/site_pages', action: 'index', site_slug: @site.slug)},
      {name: @page.id ? 'Editing "'+@page.name+'"' : 'New page'}
    ]

    render_wizard
  end

  def update
    # To avoid submitting forbidden data
    if invalid_steps.include? step
      redirect_to wizard_path(wizard_steps[0])
      return
    end
    session[:invalid_steps] << 'type' if @page.content_type

    @page.form_step = step
    case step
      when 'position'
        set_current_page_state
        move_forward

      when 'title'
        set_current_page_state
        # If the user has selected the type of page already it doesn't show the type page
        move_forward (@page.content_type ? wizard_steps[3] : next_step)

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
        move_forward Wicked::FINISH_STEP

      # OPEN CONTENT PATH
      when 'open_content'
        set_current_page_state
        move_forward next_step, next_step, next_step

      when 'open_content_preview'
        set_current_page_state
        move_forward

      # LINK PATH
      when 'link'
        set_current_page_state
        move_forward

      # MAP PATH
      when 'map'
        set_current_page_state
        move_forward
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
    temp_dataset_setting.set_filters (filters.blank? ? [] : filters.values.map { |h| h.select { |k| k != 'variable' } })

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
    params.require(:site_page).permit(:name, :description, :position, :uri, :show_on_menu,
                                      :parent_id, :content_type, content: [:url, :target_blank, :body, :json, :settings],
                                      dataset_setting: [:context_id_dataset_id, :filters,
                                                        :default_graphs, :default_map,
                                                        visible_fields: []])
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
    session[:page] = @page ? @page.attributes : nil
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

    if ids = ds_params[:context_id_dataset_id]
      ids = ids.split(' ')

      # If the user changed the id of the dataset, the entity is reset
      if @dataset_setting.dataset_id && @dataset_setting.dataset_id != ids[1]
        session[:dataset_setting] = nil
        session[:invalid_steps] = %w[type columns preview]
        @dataset_setting.filters = @dataset_setting.columns_changeable = @dataset_setting.columns_visible = nil
      end

      @dataset_setting.assign_attributes(context_id: ids[0], dataset_id: ids[1])
      ds_metadata = @dataset_setting.get_metadata
      @dataset_setting.api_table_name = ds_metadata.dig('data', 'attributes', 'tableName')
      @dataset_setting.legend = ds_metadata.dig('data', 'attributes', 'legend')

    end

    if fields = ds_params[:filters]
      fields = JSON.parse fields

      # Removes the "variable" param and sets the filters
      @dataset_setting.set_filters(fields.map { |h| h.select { |k| k != 'variable' } })

      # Sets the changeable fields from the params
      @dataset_setting.set_columns_changeable(fields.map { |h| h['name'] if h['variable'] == true }.compact)
    end

    if fields = ds_params[:visible_fields]
      @dataset_setting.columns_visible = fields.to_json
    end

    if fields = ds_params[:default_map]
      @dataset_setting.default_map = fields
    end

    if fields = ds_params[:default_graphs]
      @dataset_setting.default_graphs = fields
    end

  end

  # Saves the current data settings state in the session
  def set_current_dataset_setting_state
    session[:dataset_setting] = @dataset_setting ? @dataset_setting.attributes : nil
  end

  # Sets the current steps
  def set_steps
    invalid_steps = []
    unless @page && @page.content_type
      steps = {pages: %w[position title type],
               names: %w[Position Title Type]}
      self.steps = steps[:pages]
      self.steps_names = steps[:names]
    else
      invalid_steps << 'type' if params[:id] != 'type'
      steps = @page.form_steps
      self.steps = steps[:pages]
      self.steps_names = steps[:names]
    end

    invalid_steps << session[:invalid_steps] if session[:invalid_steps]
    invalid_steps.flatten!
    invalid_steps.uniq!
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

  # Returns true if the button pressed was save
  def save_button?
    return false unless params[:button]
    return params[:button].upcase == SAVE.upcase
  end

  # Returns true if the button pressed was publish
  def publish_button?
    return false unless params[:button]
    return params[:button].upcase == PUBLISH.upcase
  end

  # Saves the current state and goes to the next step
  # Params:
  # +next_step_name+:: Next step on pressing continue
  # +save_step_name+:: Next step on pressing save
  # +publish_step_name+:: Next step on pressing publish
  def move_forward(next_step_name = next_step,
                   save_step_name = Wicked::FINISH_STEP,
                   publish_step_name = Wicked::FINISH_STEP)

    if save_button?

      if @page.save
        redirect_to wizard_path(save_step_name)
      else
        render_wizard
      end

    elsif publish_button?

      @page.enabled = !@page.enabled
      if @page.save
        session[:page][:enabled] = @page.enabled
        redirect_to wizard_path(publish_step_name)
      else
        render_wizard
      end

    else # Continue button

      if @page.valid?
        session[:invalid_steps].delete(next_step_name)
        redirect_to wizard_path(next_step_name)
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

  # Checks is the user is in an allowed step and if not ...
  # ... redirects the user to the first step
  def redirect_invalid_step
    if invalid_steps.include? step
      redirect_to wizard_path(wizard_steps[0])
    end
  end

  # Calls the setup wizard and if the step is invalid ...
  # ... redirects the user to the first step
  def load_wizard
    begin
      setup_wizard
    rescue InvalidStepError
      redirect_to wizard_path(wizard_steps[0])
    end
  end

  # Defines the path the wizard will go when finished
  def finish_wizard_path
    management_site_site_pages_path params[:site_slug]
  end

  # Returns the list of widgets for this site
  # TODO: Check if we should see all the contexts
  def get_widgets_list
    dataset_array = []
    @site.contexts.each {|c| c.context_datasets.each {|d| dataset_array << d.dataset_id}}
    dataset_array.uniq!
    widgets = Widget.where(dataset_id: dataset_array)
    widgets.map{|w| {id: w.id, name: w.name, visualization: w.visualization, description: w.description}}
  end
end
