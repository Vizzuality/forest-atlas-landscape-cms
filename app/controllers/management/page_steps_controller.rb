class Management::PageStepsController < ManagementController
  include Wicked::Wizard
  include TreeStructureHelper
  include DatasetFieldsHelper

  before_action :authenticate_user_for_site!, only: [:new, :edit, :show, :update, :filtered_results, :widget_data]

  # The order of prepend is the opposite of its declaration
  prepend_before_action :load_wizard
  prepend_before_action :set_steps
  prepend_before_action :reset_session, only: [:new, :edit]
  prepend_before_action :set_resources, only: [:new, :edit, :show, :update, :filtered_results, :widget_data]
  prepend_before_action :ensure_session_keys_exist, only: [:new, :edit, :show, :update, :filtered_results, :widget_data]


  before_action :redirect_invalid_step

  helper_method :form_steps
  attr_accessor :steps_names
  attr_accessor :invalid_steps

  CONTINUE = 'CONTINUE'.freeze
  SAVE = 'SAVE'.freeze
  PUBLISH = 'PUBLISH'.freeze
  UNPUBLISH = 'UNPUBLISH'.freeze


  # TODO : create a session for incorrect state and last step visited (?)


  # This action cleans the session
  def new
    if params[:parent]
      parent = Page.find(params[:parent])
      if parent
        position = parent.children.length
        session[:page][@page_id] = {parent_id: params[:parent], position: position}
        redirect_to management_site_page_step_path(id: 'title')
      else
        redirect_to management_site_page_step_path(id: 'position')
      end
    else
      redirect_to management_site_page_step_path(id: 'position')
    end
  end

  # This action cleans the session
  def edit
    redirect_to wizard_path(steps[0])
  end

  def show
    case step
      when 'position'
        assign_position
      when 'title'
      when 'type'
      when 'confirmation'
      when 'dashboard_dataset'
        build_current_dashboard_setting
        vega_widgets = @site.get_vega_widgets
        @datasets_contexts = @site.get_vega_datasets(vega_widgets)
      when 'dashboard_widget'
        build_current_dashboard_setting
        @widgets = @site.get_vega_widgets([@dashboard_setting.dataset_id])
      when 'columns_selection'
        build_current_dashboard_setting
      when 'dataset'
        @datasets_contexts = @site.get_datasets_contexts
      when 'filters'
        build_current_dataset_setting
        @fields = @dataset_setting.fields
        @fields.each { |f| f[:type] = DatasetFieldsHelper.parse(f[:type]) }

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
        unless @dataset_setting.columns_visible
          @dataset_setting.set_columns_visible(@fields.map { |f| f[:name] })
        end
        set_current_dataset_setting_state

      when 'columns'
        build_current_dataset_setting
        @fields = @dataset_setting.fields

      when 'preview'
        gon.widgets = get_widgets_list

        build_current_dashboard_setting
        gon.page_name = @page.name
      # OPEN CONTENT PATH
      when 'open_content_v2'
        gon.widgets = get_widgets_list

        dataset_array = []
        @site.contexts.each {|c| c.context_datasets.each {|d| dataset_array << d.dataset_id}}
        dataset_array.uniq!

        @widgets = WidgetService.from_datasets dataset_array
        @widgets = @widgets.map do |x|
          { widget: x,
            edit_url: edit_management_site_widget_step_path(params[:site_slug], x.id),
            delete_url: management_site_widget_step_path(params[:site_slug], x.id) }
        end
        @widgets
      when 'open_content_v2_preview'
        gon.widgets = get_widgets_list

        build_current_dashboard_setting
        gon.page_name = @page.name

        dataset_array = []
        @site.contexts.each {|c| c.context_datasets.each {|d| dataset_array << d.dataset_id}}
        dataset_array.uniq!

        @widgets = WidgetService.from_datasets dataset_array
        @widgets = @widgets.map do |x|
          { widget: x,
            edit_url: edit_management_site_widget_step_path(params[:site_slug], x.id),
            delete_url: management_site_widget_step_path(params[:site_slug], x.id) }
        end
        @widgets
      when 'map'
        unless @page.persisted?
          @page.content = if MapVersion.order(:position).first.default_settings.blank?
                            {}
                          else
                            build_default_map
                          end
          gon.map_versions = MapVersion.order(:position)
        end
      when 'tag_searching'
        @tags = Tag.joins(:site_page)
                  .where(page_id: @page.site.site_pages.pluck(:id))
                  .pluck(:value).uniq
    end

    @breadcrumbs = [
      {name: @page.id ? 'Editing "'+@page.name+'"' : 'New page'}
    ]

    render_wizard
  end

  def update
    session[:invalid_steps][@page_id] ||= []
    session[:invalid_steps][@page_id] << 'type' if @page.content_type and @page.valid?

    @page.form_step = step
    case step
      when 'position'
        set_current_page_state
        move_forward
      when 'title'
        set_current_tags_state
        save_images_temporarily
        set_current_page_state
        unless @page.valid?
          render_wizard
          return
        end
        # If the user has selected the type of page already it doesn't show the type page
        move_forward next_step and return if @page_id == :new
        case @page.content_type
          when ContentType::HOMEPAGE
            move_forward next_step
          when ContentType::STATIC_CONTENT
            move_forward wizard_steps[2]
          else
            move_forward wizard_steps[3]
        end
      when 'type', 'confirmation'

        set_current_page_state
        move_forward

      # ANALYSIS DASHBOARD V2 PATH
      when 'dashboard_dataset', 'dashboard_widget', 'columns_selection'
        build_current_dashboard_setting
        set_current_dashboard_setting_state
        if @page.valid?
          move_forward
        else
          render_wizard
        end
      when 'preview'
        build_current_dashboard_setting
        set_current_dashboard_setting_state
        @page.dashboard_setting = @dashboard_setting
        move_forward Wicked::FINISH_STEP

      # OPEN CONTENT PATH
      when 'open_content_v2'
        set_current_page_state
        move_forward next_step, next_step, next_step
      when 'open_content_v2_preview'
        set_current_page_state
        move_forward next_step, next_step, next_step

      # LINK, MAP, TAG PATH
      when 'link', 'map', 'tag_searching'
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
    temp_dataset_setting.filters =
      filters.blank? ? [] : filters.values.map { |h| h.select { |k| k != 'variable' } }

    begin
      count = temp_dataset_setting.row_count
      preview = temp_dataset_setting.preview['data']
    rescue
      count = 0
      preview = []
    end
    render json: {count: count, rows: preview}.to_json
  end

  # Gets the data of a widget
  # GET /management/sites/:slug/page_steps/:id/widget_data
  def widget_data
    widget = Widget.find(params[:widget_id])
    datasets = []
    @site.contexts.each {|c| c.context_datasets.each {|cd| datasets << cd.dataset_id}}
    if datasets.include? widget.dataset_id # To get only a widget for a dataset for this site
      data = widget.get_filtered_dataset false, 10000
      render json: {id: widget.id,
                    visualization: widget.visualization,
                    name: widget.name,
                    description: widget.description,
                    data: data['data']}.to_json
    else
      render json: {}
    end
  end

  private
  def page_params
    # TODO: To have different permissions for different steps
    all_options = params.require(:site_page)
                        .fetch(:content, nil).try(:permit!)
    filtered_params =
      params.require(:site_page).permit(
        :name,
        :description,
        :position,
        :uri,
        :show_on_menu,
        :parent_id,
        :content_type,
        :page_version,
        :thumbnail,
        :cover_image,
        :delete_cover_image,
        :delete_thumbnail,
        :content,
        content: [],
        dataset_setting: [
          :dataset_id,
          :filters,
          :widgets,
          visible_fields: []
        ],
        dashboard_setting: %i[
          dataset_id
          widget_id
          content_top
          content_bottom
          columns
        ],
      )
    filtered_params[:content] = all_options if all_options.present?
    filtered_params
  end

  # Set all resources on the controller (needed because it is not possible to
  # check the current order of prepend_before_action callbacks)
  def set_resources
    set_site
    set_page

    build_current_page_state if action_name != 'new'
  end

  # Sets the current site from the url
  def set_site
    @site = Site.find_by(slug: params[:site_slug])
  end

  # Sets the page id
  def set_page
    # Verify if the manager is editing a page or creating a new one
    @page = params[:site_page_id] ? SitePage.find(params[:site_page_id]) : (SitePage.new site_id: @site.id)

    @page_id = @page&.persisted? ? @page.id.to_s : :new
  end

  # Builds the current page state based on the database, session and params
  def build_current_page_state
    # Update the page with the attributes saved on the session
    @page.assign_attributes session[:page][@page_id] if session[:page][@page_id]
    if params[:site_page] && page_params.to_h.except(:dataset_setting, :dashboard_setting, :tags)
      @page.assign_attributes page_params.to_h.except(:dataset_setting, :dashboard_setting, :tags)
    end

    @page.tags_attributes = session[:tags_attributes]["#{@page_id}"] if session[:tags_attributes]["#{@page_id}"]
  end

  # Saves the current page state in session
  def set_current_page_state
    session[:page][@page_id] = @page.attributes.except(:tags)
  end

  # Saves the current tags state
  def set_current_tags_state
    return unless params.dig 'site_page', 'tags_attributes'
    tags = params.dig('site_page', 'tags_attributes').split(' ')
    new_tags = []

    # Remove old ones
    @page.tags.find_each { |t| new_tags << { id: t.id, _destroy: 1 } unless tags.include?(t.value) }

    # Add new ones
    tags.delete_if { |t| @page.tags.pluck(:value).include?(t) }

    new_tags << tags.map { |t| { value: t } } if tags.any?
    new_tags.flatten!

    @page.tags_attributes = new_tags

    session[:tags_attributes]["#{@page_id}"] = new_tags
  end

  # Builds the current dashboard setting based on the database, session and params
  def build_current_dashboard_setting
    db_params = {}
    db_params = page_params.to_h[:dashboard_setting] if params[:site_page] && page_params&.to_h[:dashboard_setting]

    @dashboard_setting = nil
    return unless [ContentType::DASHBOARD_V2].include?(@page.content_type)
    if db_params[:id]
      @dashboard_setting = DashboardSetting.find(db_params[:id])
    elsif @page.dashboard_setting
      @dashboard_setting = @page.dashboard_setting
    else
      @dashboard_setting = DashboardSetting.new
      @page.dashboard_setting = @dashboard_setting
    end

    @dashboard_setting.assign_attributes session[:dashboard_setting]["#{@page_id}"] if session[:dashboard_setting]["#{@page_id}"]

    if ds_id = db_params[:dataset_id]
      # If the user changed the id of the dataset, the entity is reset
      if @dashboard_setting.dataset_id && @dashboard_setting.dataset_id != ds_id
        delete_session_key(:dashboard_setting, @page_id)
        session[:invalid_steps][@page_id] = %w[type dashboard_widget preview]
        @dashboard_setting.widget_id = nil
      end
    end

    @dashboard_setting.assign_attributes db_params
  end

  # Saves the current dashboard settings state in the session
  def set_current_dashboard_setting_state
    session[:dashboard_setting][@page_id] = @dashboard_setting ? @dashboard_setting.attributes : nil
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
    @dataset_setting.assign_attributes session[:dataset_setting][@page_id] if session[:dataset_setting][@page_id]

    if ds_id = ds_params[:dataset_id]

      # If the user changed the id of the dataset, the entity is reset
      if @dataset_setting.dataset_id && @dataset_setting.dataset_id != ds_id
        delete_session_key(:dataset_setting, @page_id)
        session[:invalid_steps][@page_id] = %w[type columns preview]
        @dataset_setting.filters = @dataset_setting.columns_changeable = @dataset_setting.columns_visible = nil
      end

      @dataset_setting.assign_attributes(dataset_id: ds_id)
      ds_metadata = @dataset_setting.metadata['data'].first
      if ds_metadata
        @dataset_setting.api_table_name = ds_metadata.dig('attributes', 'tableName')
        @dataset_setting.legend = ds_metadata.dig('attributes', 'legend')
      end
    end

    if fields = ds_params[:filters]
      fields = JSON.parse fields

      # Removes the "variable" param and sets the filters
      @dataset_setting.filters =
        fields.map { |h| h.select { |k| k != 'variable' } }

      # Sets the changeable fields from the params
      @dataset_setting.set_columns_changeable(
        fields.map { |h| h['name'] if h['variable'] == true }.compact
      )
    end

    if fields = ds_params[:visible_fields]
      @dataset_setting.columns_visible = fields.to_json
    end

    if fields = ds_params[:widgets]
      @dataset_setting.widgets = fields
    end
  end

  # Saves the current data settings state in the session
  def set_current_dataset_setting_state
    session[:dataset_setting][@page_id] = @dataset_setting ? @dataset_setting.attributes : nil
  end

  def save_images_temporarily
    old_cover_image = @page.persisted? && Page.find(@page.id).cover_image.url == @page.cover_image.url
    old_thumbnail = @page.persisted? && Page.find(@page.id).thumbnail.url == @page.thumbnail.url

    if @page.cover_image.present? && !old_cover_image
      temp_image = TemporaryContentImage.new
      temp_image.image = @page.cover_image
      temp_image.save
      @page.temp_cover_image = temp_image.id
      @page.cover_image = nil
    end

    if @page.thumbnail.present? && !old_thumbnail
      temp_image = TemporaryContentImage.new
      temp_image.image = @page.thumbnail
      temp_image.save
      @page.temp_thumbnail = temp_image.id
      @page.thumbnail = nil
    end
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

    invalid_steps << session[:invalid_steps][@page_id] if session[:invalid_steps][@page_id]
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

    [PUBLISH, UNPUBLISH].include? params[:button].upcase
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
      notice_text = @page.id ? 'saved' : 'created'
      if @page.save
        delete_session_key(:page, @page_id)
        delete_session_key(:tags_attributes, "#{@page_id}")
        @page.synchronise_page_widgets(page_params.to_h)
        if next_step_name == 'open_content_v2_preview'
          redirect_to management_site_site_pages_path(site_slug: @site.slug),
                      notice: "Page was successfully #{notice_text}"
        else
          redirect_to wizard_path(save_step_name, site_page_id: @page.id),
                      notice: "Page was successfully #{notice_text}"
        end
      else
        render_wizard
      end

    elsif publish_button?
      @page.enabled = !@page.enabled
      notice_text = @page.enabled ? 'published' : 'unpublished'
      if @page.save
        if publish_step_name == Wicked::FINISH_STEP # only deletes the session if there are no more pages in queue
          delete_session_key(:page, @page_id) # delete 'new' session
          reset_session_key(:page, @page.id, {enabled: @page.enabled}) # start 'edit' session
        else
          session[:page][@page_id][:enabled] = @page.enabled
        end
        # The enabled status must be stored in the session as it was changed
        delete_session_key(:tags_attributes, "#{@page_id}")
        redirect_to wizard_path(publish_step_name), notice: 'Page was successfully ' + notice_text
      else
        render_wizard
      end

    else # Continue button
      if @page.valid?
        session[:invalid_steps][@page_id].delete(next_step_name) if session[:invalid_steps][@page_id]
        redirect_to wizard_path(next_step_name)
      else
        render_wizard
      end
    end
  end

  def build_default_map
    default_map = MapVersion.order(:position).first.default_settings

    begin
      default_map_hash = JSON.parse default_map['settings']
      if default_map_hash['layerPanel']
        default_map_hash['layerPanel'] = default_map_hash['layerPanel'].to_json
        default_map['settings'] = default_map_hash.to_json
      end
      if default_map_hash['analysisModules']
        default_map_hash['analysisModules'] = default_map_hash['analysisModules'].to_json
        default_map['settings'] = default_map_hash.to_json
      end
      return default_map
    rescue
      return default_map
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
  def get_widgets_list
    dataset_array = []
    @site.contexts.each {|c| c.context_datasets.each {|d| dataset_array << d.dataset_id}}
    dataset_array.uniq!
    widgets = WidgetService.from_datasets dataset_array
    widgets.map do |w|
      { id: w.id, name: w.name,
        visualization: w.widget_config, description: w.description }
    end
  end

  def ensure_session_keys_exist
    session[:dashboard_setting] ||= {}
    session[:dataset_setting] ||= {}
    session[:invalid_steps] ||= {}
    session[:page] ||= {}
    session[:tags_attributes] ||= {}
  end

  def reset_session
    pages = params['action'] == 'new' ? %w[type title] : %w[type]
    reset_session_key(:dashboard_setting, @page_id, {})
    reset_session_key(:dataset_setting, @page_id, {})
    reset_session_key(:invalid_steps, @page_id, pages)
    reset_session_key(:tags_attributes, "#{@page_id}", {})
    reset_session_key(:page, @page_id, {})
    reset_session_key(:page, :new, {})
  end
end
