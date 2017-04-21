class Management::WidgetStepsController < ManagementController
  include Wicked::Wizard

  before_action :build_widget
  prepend_before_action :ensure_session_keys_exist, only: [:new, :edit, :show, :update]

  steps *Widget.form_steps[:pages]

  attr_accessor :steps_names

  CONTINUE = 'CONTINUE'.freeze
  SAVE = 'SAVE'.freeze

  def new
    reset_session_key(:widget, @widget_id, {})
    redirect_to management_site_widget_step_path(id: 'title')
  end

  def edit
    reset_session_key(:widget, @widget_id, {})
    redirect_to wizard_path('title')
  end

  def show
    breadcrumbs = @widget.id ? {name: "Editing \"#{@widget.name}\""} : {name: 'New Widget'}
    @breadcrumbs << breadcrumbs

    case step
      when 'title'
      when 'dataset'
        get_datasets
      when 'filters'
        set_gon_filters

        # Saving all the possible visible fields for this widget so that ...
        # ... they can be used in the filtered_results
        (@widget.set_columns_visible(
          @fields.map { |f| f[:name] })) unless @widget.columns
        set_widget_state

      when 'visualization'
        gon.data = @widget.get_filtered_dataset
        gon.legend = @widget.legend
        gon.analysis_timestamp = @widget.fields_last_modified
        gon.visualization = @widget.visualization
    end
    render_wizard
  end

  def update
    set_widget_state
    case step
      when 'title'

        if save_button?
          if @widget.save
            delete_session_key(:widget, @widget_id)
            redirect_to management_site_widgets_path
          else
            render_wizard
          end
        else
          if @widget.valid?
            redirect_to next_wizard_path
          else
            render_wizard
          end
        end

      when 'dataset'

        if save_button?
          if @widget.save
            delete_session_key(:widget, @widget_id)
            redirect_to management_site_widgets_path
          else
            get_datasets
            render_wizard
          end
        else
          if @widget.valid?
            redirect_to next_wizard_path
          else
            get_datasets
            render_wizard
          end
        end

      when 'filters'

        if save_button?
          if @widget.save
            delete_session_key(:widget, @widget_id)
            redirect_to management_site_widgets_path
          else
            get_fields
            render_wizard
          end
        else
          if @widget.valid?
            redirect_to next_wizard_path
          else
            get_fields
            render_wizard
          end
        end

      when 'visualization'
        if @widget.save
          delete_session_key(:widget, @widget_id)
          respond_to do |format|
            format.html { redirect_to management_site_widgets_path, notice: 'Widget was successfully created.' }
          end
        else
          set_gon_filters
          render_wizard
        end
    end

  end

  # TODO : Move this to a service
  def filtered_results
    unless @widget && @widget.dataset_id && @widget.api_table_name
      render json: {count: 0, rows: []}.to_json
      return
    end

    temp_widget =
      Widget.new(dataset_id: @widget.dataset_id,
                         api_table_name: @widget.api_table_name)

    filters = params[:filters]
    temp_widget.set_filters (filters.blank? ? [] : filters.values.map { |h| h.select { |k| k != 'variable' } })

    begin
      count = temp_widget.get_row_count
      preview = temp_widget.get_preview['data']
    rescue
      count = temp_widget.get_row_count
      preview = []
    end
    render json: {count: count, rows: preview}.to_json

  end

  private
  def widget_params
    params.require(:widget).permit(:name, :description, :dataset_id,
                                   :api_table_name, :legend, :filters, :columns, :visualization )
  end

  def build_widget
    @site = Site.find_by(slug: params[:site_slug]) # Used because the widgets are still inside the site
    @widget = params[:widget_id] ? Widget.find(params[:widget_id]) : Widget.new
    @widget_id = if @widget && @widget.persisted?
      @widget.id
    else
      :new
    end

    # Update the widget with the info saved on the session and sent by params
    @widget.assign_attributes session[:widget][@widget_id] if session[:widget][@widget_id]
    if params[:widget] && widget_params
      @widget.assign_attributes widget_params.to_h
      if widget_params[:dataset_id]
        ds_metadata = DatasetService.get_metadata widget_params[:dataset_id]
        @widget.api_table_name = ds_metadata.dig('data', 'attributes', 'tableName')
        @widget.legend = ds_metadata.dig('data', 'attributes', 'legend')
      end
    end

    self.steps_names= @widget.form_steps[:names]
    @widget.form_step = step

  end

  def get_datasets
    @datasets_contexts = @site.get_datasets_contexts
  end

  def get_fields
    @fields = @widget.get_fields
    @fields.each { |f| f[:type] = 'number' if %w[double long int float].any? { |x| f[:type].downcase == x } }
    @fields.each { |f| f[:type] = 'string' if %w[string text].any? { |x| f[:type].downcase == x } }
    @fields.each { |f| f[:type] = 'date' if f[:type].downcase == 'date' }
  end

  def set_widget_state
    session[:widget][@widget_id] = @widget ? @widget.attributes : nil
  end

  def set_gon_filters
    get_fields
    gon.fields = @fields
    gon.filters_endpoint_url = wizard_path('filters') + '/filtered_results.json'
    gon.filters_array = if @widget.filters
                          JSON.parse @widget.filters
                        else
                          nil
                        end
  end

  def save_button?
    return false unless params[:button]
    return params[:button].upcase == SAVE.upcase
  end

  def ensure_session_keys_exist
    session[:widget] ||= {}
  end
end
