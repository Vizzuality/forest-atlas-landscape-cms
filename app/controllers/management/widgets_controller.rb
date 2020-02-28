class Management::WidgetsController < ManagementController
  before_action :set_site
  before_action :set_widgets, only: :index
  before_action :authenticate_user_for_site!
  before_action :ensure_management_user, only: :destroy

  def index; end

  def destroy
    response = WidgetService.delete(
      user_token(@site),
      params[:dataset],
      params[:id]
    )

    flash[response[:valid] ? :notice : :error] = response[:message]

    render :index
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_site
    @site = Site.find_by(slug: params[:site_slug])

    # We just want a valid URL for the site
    @url = @site.routes.first.host_with_scheme if @site.routes.any?
  end

  def set_widgets
    datasets = @site.
      get_datasets(current_user, user_token(@site, true)).map do |d|
        {id: d.id, name: d.name, user: d.user}
      end

    widgets = if datasets.blank?
                []
              else
                # Get widgets associated to the datasets of the current user
                WidgetService.from_datasets(datasets.map { |d| d[:id] }, 'saved', user_token(@site, true))
              end

    @widgets = process_widgets(datasets, widgets)
  end

  def process_widgets(datasets, widgets)
    widgets.map do |x|
      # Get widget metadata information (private_name needed on table)
      widget = WidgetService.widget x.id, user_token(@site, true)

      # Set the name of the dataseta
      dataset = datasets.find { |d| d[:id] == widget.dataset }
      next unless dataset
      widget.dataset_name = dataset[:name]

      processed_widget = {widget: widget}
      processed_widget['edit_url'] = edit_url(widget) if edit_url(widget)
      if delete_url(dataset[:id], widget.id)
        processed_widget['delete_url'] = delete_url(dataset[:id], widget.id)
      end
      processed_widget
    end.compact
  end

  def edit_url(widget)
    return if !current_user_is_admin &&
      !current_user.owned_sites.include?(@site) &&
      current_user.email != widget.user.dig('email')

    edit_management_site_widget_step_path(
      params[:site_slug],
      widget.id
    )
  end

  # Only shows the delete url in case the user is a site admin for this site
  def delete_url(dataset_id, widget_id)
    return if !current_user_is_admin &&
      !current_user.owned_sites.include?(@site)

    management_site_widget_path(
      params[:site_slug],
      widget_id,
      action: :delete,
      dataset: dataset_id
    )
  end
end
