class Management::StaticPageController < ManagementController

  # GET /management
  def dashboard
    if user_can?('access_admin')
      @sites = Site
    else
      @sites = Site.joins(:users).where(users: {id: current_user.id})
    end

    @sites = @sites.paginate(:page => params[:page], :per_page => params[:per_page])
               .order(params[:order] || 'created_at ASC')

    @breadcrumbs = [{name: 'Dashboard', url: management_path}]

    respond_to do |format|
      format.html { render layout: 'management' }
      format.json { render json: @sites.map {|s| s.attributes} }
    end
  end
end
