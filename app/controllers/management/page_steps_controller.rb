class Management::PageStepsController < ManagementController
  include Wicked::Wizard

  before_action :set_site, only: [:new, :edit, :show, :update]

  CONTINUE = 'CONTINUE'.freeze
  SAVE     = 'SAVE CHANGES'.freeze

  # Steps for Analysis Dashboard
  steps :dataset, :filters, :columns, :customization, :preview

  # Common steps
  # steps %w[position name type]

  # Steps for Open Content
  # steps %w[wysiwyg preview]

  # Steps for Dynamic Indicator Dashboard
  # steps %w[widgets style preview]

  # This action cleans the session
  def new
    session[:page] = {uri: 'test'}
    session[:dataset_setting] = {}
    # The next line should be used. While developing this feature...
    # ... there will be a direct jump to datasets
    # redirect_to management_page_step_path(id: :position)
    redirect_to management_site_page_step_path(id: :dataset)
  end

  # This action cleans the session
  def edit
    session[:page] = {}
    session[:dataset_setting] = {}
    redirect_to management_site_page_step_path(page: params[:page_id], id: :dataset)
  end

  def show
    case step
    when :dataset
      @page = current_page
      @context_datasets = current_user.get_context_datasets
    when :filters
      @page = current_page
      @dataset_setting = current_dataset_setting
      @fields = @dataset_setting.get_fields
    when :columns
      @page = current_page
      @dataset_setting = current_dataset_setting
      @fields = @dataset_setting.get_fields
      gon.fields = @fields
    end

    @breadcrumbs = ['Page creation']

    render_wizard
  end

  def update
    @page = current_page
    case step
      when :dataset
        @dataset_setting = current_dataset_setting
        session[:page] = @page
        session[:dataset_setting] = @dataset_setting
        # TODO: Add validation
        redirect_to next_wizard_path
      when :filters

      when :columns
        @dataset_setting = current_dataset_setting
        session[:page] = @page
        session[:dataset_setting] = @dataset_setting
        # TODO: Add validation
        redirect_to next_wizard_path
    end
  end

  private
  def page_params
    params.require(:page).permit(:name, dataset_setting: [:context_id_dataset_id, visible_fields: [] ])
  end

  def set_site
    @site = Site.find_by({slug: params[:site_slug]})
  end

  def current_page
    page = params[:page_id] ? SitePage.find(params[:page_id]) : SitePage.new
    session[:page].merge!(page_params.to_h.except(:dataset_setting)) if params[:page] && page_params.to_h && page_params.to_h.except(:dataset_setting)
    unless session[:page].blank?
      new_attributes = session[:page].clone
      new_attributes.delete('url')
      page.assign_attributes new_attributes
    end
    page
  end

  def current_dataset_setting
    ds_params = {}
    ds_params = page_params.to_h[:dataset_setting] if params[:page] && page_params.to_h

    dataset_setting = nil
    if ds_params[:id]
      dataset_setting = DatasetSetting.find(ds_params[:id])
    else
      if ids = ds_params[:context_id_dataset_id]
        ids = ids.split(' ')
        dataset_setting = DatasetSetting.new(context_id: ids[0], dataset_id: ids[1])
        ds_params[:dataset_id] = ids[1]
        ds_params[:context_id] = ids[0]
        ds_params.delete(:context_id_dataset_id)
      end
      dataset_setting = DatasetSetting.new unless dataset_setting
    end

    if fields = ds_params[:visible_fields]
      columns_visible = fields.join(' ')
      ds_params.delete(:visible_fields)
      ds_params[:columns_visible] = columns_visible
      dataset_setting.columns_visible = columns_visible
    end

    session[:dataset_setting].merge!(ds_params) unless ds_params.blank?
    dataset_setting.assign_attributes session[:dataset_setting]
    dataset_setting
  end
end
