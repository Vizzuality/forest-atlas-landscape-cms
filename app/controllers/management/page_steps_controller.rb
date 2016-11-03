class Management::PageStepsController < ManagementController
  include Wicked::Wizard

  before_action :set_site, only: [:new, :edit, :show, :update]

  CONTINUE = 'CONTINUE'.freeze
  SAVE     = 'SAVE CHANGES'.freeze

  # Steps for Analysis Dashboard
  steps :dataset, :filters, :columns, :visibility, :customization, :preview

  # Common steps
  # steps %w[position name type]

  # Steps for Open Content
  # steps %w[wysiwyg preview]

  # Steps for Dynamic Indicator Dashboard
  # steps %w[widgets style preview]

  # This action cleans the session
  def new
    session[:page] = {}
    # The next line should be used. While developing this feature...
    # ... there will be a direct jump to datasets
    # redirect_to management_page_step_path(id: :position)
    redirect_to management_page_step_path(site_slug: params[:site_slug], id: :dataset)
  end

  # This action cleans the session
  def edit
    session[:page] = {}
    redirect_to management_site_page_step_path(page: params[:page_id], id: :dataset)
  end

  def show
    if step == :dataset
      @page = current_page
      @datasets = DatasetService.get_datasets

    end
    render_wizard
  end

  def update
    case step
      when 'dataset'
        @page = current_page
    end
  end

  private
  def page_params
    params.require(:page).permit(:name)
  end

  def set_site
    @site = Site.find_by({slug: params[:site_slug]})
  end

  def current_page
    page = params[:page_id] ? SitePage.find(params[:page_id]) : SitePage.new
    session[:page].merge!(page_params.to_h) if params[:page] && page_params.to_h
    page.assign_attributes session[:page] if session[:page]
    page
  end
end
