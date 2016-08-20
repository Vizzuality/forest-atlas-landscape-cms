class Management::SitesController < ManagementController

  # GET /management/sites
  # GET /management/sites.json
  def index
    @sites = Site.joins(:users)
               .where(users: {id: current_user.id})
               .paginate(:page => params[:page], :per_page => params[:per_page])
               .order(params[:order] || 'created_at ASC')

    respond_to do |format|
      format.html { render :index }
      format.json { render json: @sites }
    end
  end

  private
  # Never trust parameters from the scary internet, only allow the white list through.
  def site_params
    params.require(:site).permit(:name, :site_template_id, {user_ids: []})
  end
end
