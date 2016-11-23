class Management::PageStepsController < ManagementController
  include Wicked::Wizard

  # The order of prepend is the opposite of its declaration
  prepend_before_action :set_steps
  prepend_before_action :build_current_page_state, only: [:show, :update]
  prepend_before_action :set_site, only: [:new, :edit, :show, :update]
  before_action :setup_wizard

# TODO: Authenticate user per site
# before_action :authenticate_user_for_site!, only: [:index, :new, :create]
# before_action :set_content_type_variables, only: [:new, :edit]

  helper_method :form_steps
  attr_accessor :steps_names
  attr_accessor :invalid_steps

  CONTINUE = 'CONTINUE'.freeze
  SAVE     = 'SAVE CHANGES'.freeze

  # This action cleans the session
  def new
    # TODO: change this when the pages are unified
    if params[:position] && params[:parent_id]
      session[:page] =  {uri: "test-#{DateTime.new.to_id}", parent_id: params[:parent_id], position: params[:position]}
    else
      session[:page] = {uri: "test-#{DateTime.new.to_i}", parent_id: @site.root.id, position: @site.site_pages.where(parent_id: @site.root.id).length}
    end

    session[:dataset_setting] = {}

    # TODO: The next line should be used. While developing this feature...
    # ... there will be a direct jump to datasets
    # redirect_to management_page_step_path(id: :position)
    redirect_to management_site_page_step_path(id: 'position')
  end

  # This action cleans the session
  def edit
    session[:page] = {}
    session[:dataset_setting] = {}
    redirect_to next_wizard_path
    #redirect_to management_site_page_step_path(page: params[:page_id], id: 'dataset')
  end

  def show
    case step
      when 'position'
      when 'title'
      when 'type'

      when 'dataset'
        @context_datasets = current_user.get_context_datasets

      when 'filters'
        build_current_dataset_setting
        @fields = @dataset_setting.get_fields
        gon.fields = @fields

      when 'columns'
        build_current_dataset_setting
        @fields = @dataset_setting.get_fields

      when 'customization'
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

       # TODO: Is this supposed to have only page creation?
      @breadcrumbs = ['Page creation']

      render_wizard
  end

  # TODO: REFACTOR
  def update
    case step
      when 'position'
        redirect_to next_wizard_path

      when 'title'
        redirect_to next_wizard_path

      when 'type'
        set_current_page_state
        redirect_to next_wizard_path

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
        if @page.valid?
          redirect_to next_wizard_path
        else
          render_wizard
        end

      when 'columns'
        build_current_dataset_setting
        set_current_dataset_setting_state
        if @page.valid?
          redirect_to next_wizard_path
        else
          render_wizard
        end

      when 'customization'
        build_current_dataset_setting
        set_current_dataset_setting_state
        set_current_page_state
        if @page.valid?
          redirect_to next_wizard_path
        else
          render_wizard
        end

      when 'preview'
        build_current_dataset_setting
        set_current_dataset_setting_state
        @page.dataset_setting = @dataset_setting
        if @page.save
          redirect_to management_site_site_pages_path params[:site_slug]
        else
          render_wizard
        end

      # OPEN CONTENT PATH
      when 'open_content'
        build_current_dataset_setting
        set_current_dataset_setting_state
        if @page.valid?
          redirect_to next_wizard_path
        else
          render_wizard
        end

      when 'open_content_preview'
        # TODO : When validations are done, put this back
        #if @page.save
          redirect_to management_site_site_pages_path params[:site_slug]
        #else
        #  render_wizard
        #end

      # DYNAMIC INDICATOR DASHBOARD PATH
      when 'widget'
        redirect_to next_wizard_path

      when 'dynamic_indicator_dashboard'
        redirect_to next_wizard_path

      when 'dynamic_indicator_dashboard_preview'
        # TODO: When the validations are done, put this back
        #if @page.save
          redirect_to management_site_site_pages_path params[:site_slug]
        #else
        #  render_wizard
        #end

      # LINK PATH
      when 'link'
        if @page.save
          redirect_to management_site_site_pages_path params[:site_slug]
        else
          render_wizard
        end
    end
  end

  private
  def page_params
    # TODO: To have different permissions for different steps
    params.require(:site_page).permit(:name, :description, :content_type, content: [:url, :target_blank], dataset_setting: [:context_id_dataset_id, :filters, visible_fields: []])
  end

  def set_site
    @site = Site.find_by({slug: params[:site_slug]})
  end

  def build_current_page_state
    # Verify if the manager is editing a page or creating a new one
    @page = params[:page_id] ? SitePage.find(params[:page_id]) : (SitePage.new site_id: @site.id)

    # Update the page with the attributes saved on the session
    @page.assign_attributes session[:page] if session[:page]
    @page.assign_attributes page_params.to_h.except(:dataset_setting) if params[:site_page] && page_params.to_h.except(:dataset_setting)

  end

  def set_current_page_state
    session[:page] = @page
  end

  def build_current_dataset_setting
    ds_params = {}
    ds_params = page_params.to_h[:dataset_setting] if params[:site_page] && page_params.to_h && page_params.to_h[:dataset_setting]

    @dataset_setting = nil
    if ds_params[:id]
      @dataset_setting = DatasetSetting.find(ds_params[:id])
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

    if fields = ds_params[:filters]
      fields = JSON.parse fields
      filters = []
      changeables = []
      fields.each do |field|
        name = field['name']
        from = field['from']
        to = field['to']
        changeables << field['name'] if field['variable'] == 'true'
        filters << "#{name} between #{from} and #{to}"
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

  def set_current_dataset_setting_state
    session[:dataset_setting] = @dataset_setting
  end

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
      invalid_steps = ['title']
    end
    set_invalid_steps invalid_steps
  end

  def form_steps
    self.steps
  end

  def set_invalid_steps(steps)
    self.invalid_steps = steps
  end
end
