class Admin::StaticPageController < AdminController

  # GET /admin
  def dashboard
    render layout: "admin"
  end
end
