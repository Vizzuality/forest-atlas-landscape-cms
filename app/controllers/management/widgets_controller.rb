class Management::WidgetsController < ManagementController
  before_action :set_site, only: [:index, :new, :create]
  before_action :authenticate_user_for_site!
  #before_action :set_content_type_variables, only: [:new, :edit]

  def index
    gon_widgets = []
    begin
      dataset_ids = []
      @site.contexts.each do |context|
        context.context_datasets.each do |dataset|
          dataset_ids << dataset.dataset_id
        end
      end
      dataset_ids.uniq!

      widgets = Widget.where(dataset_id: dataset_ids)
      widgets.each do |widget|
        gon_widgets << {id: widget.id, name: widget.name,
                         description: widget.description, visualization: widget.visualization}
      end
    rescue
    end
    gon.widgets = gon.widgets
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
