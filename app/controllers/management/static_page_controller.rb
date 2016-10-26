class Management::StaticPageController < ManagementController

  # GET /management
  def dashboard
    if (current_user.admin?)
      @sites = Site
    else
      @sites = Site.joins(:users).where(users: {id: current_user.id})
    end

    @sites = @sites.paginate(:page => params[:page], :per_page => params[:per_page])
               .order(params[:order] || 'created_at ASC')

    @breadcrumbs = ['Dashboard']

    respond_to do |format|
      format.html { render layout: "management" }
      format.json { render json: @sites }
    end
  end
end
