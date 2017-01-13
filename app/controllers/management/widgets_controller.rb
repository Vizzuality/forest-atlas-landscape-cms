class Management::WidgetsController < ManagementController
  before_action :set_site
  before_action :authenticate_user_for_site!
  #before_action :set_content_type_variables, only: [:new, :edit]

  def index
    begin
      dataset_ids = []
      @site.contexts.each do |context|
        context.context_datasets.each do |dataset|
          dataset_ids << dataset.dataset_id
        end
      end
      dataset_ids.uniq!

      widgets = Widget.where(dataset_id: dataset_ids)
      gon.widgets = widgets.map do |widget|
        {
          'name' => {'value' => widget.name, 'searchable' => true, 'sortable' => true},
          'description' => {'value' => widget.description, 'searchable' => true, 'sortable' => true},
          'chart' => {'value' => widget.visualization, 'searchable' => true, 'sortable' => true},
          # 'edit' => {'value' => management_site_widget_path(page.site.slug, widget.id), \
          #          'method' => 'get'},
        }
      end
    rescue
    end
  end

  def destroy
    @widget = Widget.find(params[:id])
    @widget.destroy
    redirect_to management_site_widgets_path
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_site
    @site = Site.find_by({slug: params[:site_slug]})

    if (@site.routes.any?)
      # We just want a valid URL for the site
      @url = @site.routes.first.host
    end
  end

end
