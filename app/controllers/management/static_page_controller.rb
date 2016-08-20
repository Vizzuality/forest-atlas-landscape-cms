class Management::StaticPageController < ManagementController

  # GET /management
  def dashboard
    render layout: "management"
  end
end
