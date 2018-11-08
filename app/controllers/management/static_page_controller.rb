class Management::StaticPageController < ManagementController

  # GET /management
  def dashboard
    @sites = if user_can?('access_admin_only')
               Site
             else
               Site.joins(:users).where(users: {id: current_user.id})
             end

    @sites = @sites.order('created_at ASC')

    respond_to do |format|
      format.html { render layout: 'management' }
      format.json { render json: @sites.map { |s| s.attributes} }
    end
  end
end
