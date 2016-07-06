class Management::PagesController < ManagementController
  before_action :set_page, only: [:show, :edit, :update, :destroy]

  # GET /management/pages
  # GET /management/pages.json
  def index
    @pages = Page.all
  end

  # GET /management/pages/1
  # GET /management/pages/1.json
  def show
  end

  # GET /management/pages/new
  def new
    @page = Page.new
  end

  # GET /management/pages/1/edit
  def edit
  end

  # POST /management/pages
  # POST /management/pages.json
  def create
    @page = Page.new(page_params)

    respond_to do |format|
      if @page.save
        format.html { redirect_to management_page_path(@page), notice: 'Page was successfully created.' }
        format.json { render :show, status: :created, location: @page }
      else
        format.html { render :new }
        format.json { render json: @page.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /management/pages/1
  # PATCH/PUT /management/pages/1.json
  def update
    respond_to do |format|
      if @page.update(page_params)
        format.html { redirect_to management_page_path(@page), notice: 'Page was successfully updated.' }
        format.json { render :show, status: :ok, location: @page }
      else
        format.html { render :edit }
        format.json { render json: @page.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /management/pages/1
  # DELETE /management/pages/1.json
  def destroy
    @page.destroy
    respond_to do |format|
      format.html { redirect_to pages_url, notice: 'Page was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_page
    @page = Page.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def page_params
    params.require(:page).permit(:name, :description, :site_id, :uri, :content)
  end
end
