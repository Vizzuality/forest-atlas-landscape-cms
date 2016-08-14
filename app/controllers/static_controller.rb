class StaticController < ApplicationController
  before_action :authenticate_user!

  def admin
    render layout: "admin"
  end

  def management
    render layout: "management"
  end
end
