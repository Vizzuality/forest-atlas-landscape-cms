class StaticController < ApplicationController
  before_action :authenticate_user!, :only => :admin

  def admin
    render layout: "admin"
  end
end
