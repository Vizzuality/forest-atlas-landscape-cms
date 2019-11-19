class Admin::PreviewController < AdminController
  before_action :load_site
  before_action :ensure_only_admin_user

  def index
    respond_to do |format|
      format.html { render :index }
    end
  end

  def compile
    CompilePreviewWorker.perform_async(current_user.id, @site.id)

    head :ok
  end

  private

  def load_site
    @site = Site.find_by(slug: params[:site_slug])
  end
end
