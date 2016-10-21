class Admin::DatasetsController < AdminController

  # GET /admin/page_templates
  # GET /admin/page_templates.json
  def index
    @datasets = DatasetService.get_datasets

    respond_to do |format|
      format.html { render :index }
      format.json { render json: @datasets }
    end
  end
end
