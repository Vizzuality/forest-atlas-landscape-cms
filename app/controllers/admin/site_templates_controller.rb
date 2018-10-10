# TODO - Should this exist?

class Admin::SiteTemplatesController < AdminController
  before_action :ensure_only_admin_user
  before_action :set_site_template, only: [:show, :edit, :update, :destroy]

  # GET /site_templates
  # GET /site_templates.json
  def index
    @site_templates = SiteTemplate.all
  end

  # GET /site_templates/1
  # GET /site_templates/1.json
  def show
  end

  # GET /site_templates/new
  def new
    @site_template = SiteTemplate.new
  end

  # GET /site_templates/1/edit
  def edit
  end

  # POST /site_templates
  # POST /site_templates.json
  def create
    @site_template = SiteTemplate.new(site_template_params)

    respond_to do |format|
      if @site_template.save
        format.html { redirect_to admin_site_template_path(@site_template), notice: 'Site template was successfully created.' }
        format.json { render :show, status: :created, location: @site_template }
      else
        format.html { render :new }
        format.json { render json: @site_template.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /site_templates/1
  # PATCH/PUT /site_templates/1.json
  def update
    respond_to do |format|
      if @site_template.update(site_template_params)
        format.html { redirect_to admin_site_template_path(@site_template), notice: 'Site template was successfully updated.' }
        format.json { render :show, status: :ok, location: @site_template }
      else
        format.html { render :edit }
        format.json { render json: @site_template.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /site_templates/1
  # DELETE /site_templates/1.json
  def destroy
    @site_template.destroy
    respond_to do |format|
      format.html { redirect_to site_templates_url, notice: 'Site template was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_site_template
      @site_template = SiteTemplate.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def site_template_params
      params.require(:site_template).permit(:name)
    end
end
