class Management::WidgetsController < ManagementController
  before_action :set_site
  before_action :authenticate_user_for_site!
  before_action :ensure_management_user, only: :destroy

  def index
    dataset_ids = @site.contexts
                       .map { |c| c.context_datasets.pluck(:dataset_id) }
                       .flatten.uniq

    # TODO
    # TODO
    # TODO ---> the widgets must be per dataset
    #widgets = Widget.where(dataset_id: dataset_ids)
    @widgets = WidgetService.get_widgets
    @widgets = @widgets.map do |x|
      { widget: x,
        edit_url: edit_management_site_widget_step_path(params[:site_slug], x.id),
        delete_url: management_site_widget_step_path(params[:site_slug], x.id) }
    end
    @widgets
  end

  def destroy

  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_site
    @site = Site.find_by({slug: params[:site_slug]})

    if (@site.routes.any?)
      # We just want a valid URL for the site
      @url = @site.routes.first.host_with_scheme
    end
  end

end
