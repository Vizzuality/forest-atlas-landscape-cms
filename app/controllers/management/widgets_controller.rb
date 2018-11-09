class Management::WidgetsController < ManagementController
  before_action :set_site
  before_action :authenticate_user_for_site!
  before_action :ensure_management_user, only: :destroy

  def index
    dataset_ids = @site.get_datasets(current_user).map(&:id)
    @widgets = WidgetService.from_datasets dataset_ids
    @widgets = @widgets.map do |x|
      { widget: x,
        edit_url: edit_management_site_widget_step_path(params[:site_slug], x.id),
        delete_url: delete_url(x.dataset, x.id) }
    end
    gon.clement = @widgets
    @widgets
  end

  def destroy
    response = WidgetService.delete(session[:user_token], params[:dataset],params[:id])
    if response[:valid]
      render :index, notice: response[:message]
    else
      render :index, error: response[:message]
    end
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

  # Only shows the delete url in case the user is a site admin for this site
  def delete_url(dataset_id, widget_id)
    return unless current_user_is_admin || current_user.owned_sites.include?(@site)
    management_site_widget_path(params[:site_slug], widget_id, action: :delete, dataset: dataset_id)
  end
end
