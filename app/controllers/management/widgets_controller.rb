class Management::WidgetsController < ManagementController
  before_action :set_site, only: [:index, :new, :create]
  before_action :authenticate_user_for_site!
  #before_action :set_content_type_variables, only: [:new, :edit]

  def index
    gon.datasets = ''
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
