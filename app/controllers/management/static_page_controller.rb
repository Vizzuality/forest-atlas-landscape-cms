class Management::StaticPageController < ManagementController

  # GET /management
  def dashboard
    @sites = Site.joins(:users)
               .where(users: {id: current_user.id})
               .paginate(:page => params[:page], :per_page => params[:per_page])
               .order(params[:order] || 'created_at ASC')

    render layout: "management"
  end
end
