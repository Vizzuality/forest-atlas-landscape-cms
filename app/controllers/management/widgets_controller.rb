class Management::WidgetsController < ManagementController
  before_action :set_site
  before_action :authenticate_user_for_site!
  before_action :ensure_management_user, only: :destroy
  #before_action :set_content_type_variables, only: [:new, :edit]

  def index
    dataset_ids = @site.contexts.map{ |c| c.context_datasets.pluck(:dataset_id) }.flatten.uniq
    widgets = Widget.where(dataset_id: dataset_ids)
    publisher = (current_user.roles.include? UserType::PUBLISHER)
    @formattedWidgets = widgets.map do |widget|
      {
        'name' => {'value' => widget.name, 'searchable' => true, 'sortable' => true},
        'description' => {'value' => widget.description, 'searchable' => true, 'sortable' => true},
        'chart' => {'value' => widget.visualization, 'searchable' => true, 'sortable' => true},
        'chart type' => { 'value' => JSON.parse(widget.visualization)['type'], 'searchable' => true, 'sortable' => true},
        'edit' => {'value' => edit_management_site_widget_widget_step_path(site_slug: @site.slug, widget_id: widget.id, id: 'title'), \
                  'method' => 'get'},
        'delete' => publisher ? {'value' => nil} : {'value' => management_site_widget_path(@site.slug, widget.id), 'method' => 'delete'}
      }
      end

    gon.widgets = @formattedWidgets

    gon.widget_pages = Hash[
      widgets.map do |widget|
        [
          widget.id,
          widget.pages.select(:id, :name, :site_id, :url).map do |page|
            {
              page: page,
              site: page.site.attributes.slice('id', 'name', 'slug')
            }
          end
        ]
      end
    ]



  end

  def destroy
    @widget = Widget.find(params[:id])
    if @widget.destroy
      redirect_to management_site_widgets_path, notice: 'Widget was successfully destroyed.'
    else
      redirect_to management_site_widgets_path, :flash => { :display => {
        type: "WidgetDeletionError",
        content: @widget.errors[:base].first
      } }
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

end
