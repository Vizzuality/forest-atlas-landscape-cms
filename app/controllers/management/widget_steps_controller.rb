class Management::WidgetStepsController < ManagementController
  include Wicked::Wizard

  before_action :build_widget

  steps *Widget.form_steps[:pages]

  attr_accessor :steps_names

  def new
    session[:widget] = {}
    redirect_to management_site_widget_step_path(id: 'title')
  end

  def edit
    session[:widget] = {}
    redirect_to wizard_path('title')
  end

  def show
    render_wizard
  end

  def update
    redirect_to next_wizard_path
  end

  private
  def build_widget
    @site = Site.find_by(slug: params[:site_slug])
    @widget = Widget.new

    self.steps_names= @widget.form_steps[:names]

    #TODO : CHANGE THIS!!!
    @context_datasets = current_user.get_context_datasets
    @fields = @widget.get_fields
  end
end
