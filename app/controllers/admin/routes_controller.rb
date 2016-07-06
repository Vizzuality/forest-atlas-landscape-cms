class Admin::RoutesController < AdminController
  before_action :set_route, only: [:show, :edit, :update, :destroy]

  # GET /admin/routes
  # GET /admin/routes.json
  def index
    @routes = Route.all
  end

  # GET /admin/routes/1
  # GET /admin/routes/1.json
  def show
  end

  # GET /admin/routes/new
  def new
    @route = Route.new
  end

  # GET /admin/routes/1/edit
  def edit
  end

  # POST /admin/routes
  # POST /admin/routes.json
  def create
    @route = Route.new(route_params)

    respond_to do |format|
      if @route.save
        format.html { redirect_to admin_route_path(@route), notice: 'Route was successfully created.' }
        format.json { render :show, status: :created, location: @route }
      else
        format.html { render :new }
        format.json { render json: @route.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/routes/1
  # PATCH/PUT /admin/routes/1.json
  def update
    respond_to do |format|
      if @route.update(route_params)
        format.html { redirect_to admin_route_path(@route), notice: 'Route was successfully updated.' }
        format.json { render :show, status: :ok, location: @route }
      else
        format.html { render :edit }
        format.json { render json: @route.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/routes/1
  # DELETE /admin/routes/1.json
  def destroy
    @route.destroy
    respond_to do |format|
      format.html { redirect_to admin_routes_url, notice: 'Route was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_route
      @route = Route.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def route_params
      params.require(:route).permit(:host, :path, :site_id)
    end
end
