class Management::WidgetsController < ManagementController
  before_action :set_site
  before_action :authenticate_user_for_site!
  before_action :ensure_management_user, only: :destroy
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

      publisher = (current_user.role == UserType::PUBLISHER)
      gon_widgets = []
      if widgets.any?
        gon_widgets = widgets.map do |widget|
          {
            'name' => {'value' => widget.name, 'searchable' => true, 'sortable' => true},
            'description' => {'value' => widget.description, 'searchable' => true, 'sortable' => true},
            'chart' => {'value' => widget.visualization, 'searchable' => true, 'sortable' => true},
            'edit' => {'value' => edit_management_site_widget_widget_step_path(site_slug: @site.slug, widget_id: widget.id, id: 'title'), \
                      'method' => 'get'},
            'delete' => publisher ? {'value' => nil} : {'value' => management_site_widget_path(@site.slug, widget.id), 'method' => 'delete'}
          }
        end
      end

      gon.widgets = gon_widgets

    rescue
    end
  end

  def destroy
    @widget = Widget.find(params[:id])
    if @widget.destroy
      redirect_to management_site_widgets_path, notice: 'Widget was successfully destroyed.'
    else
      redirect_to management_site_widgets_path, alert: 'Failed: ' + @widget.errors[:base].join(', ')
    end
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
