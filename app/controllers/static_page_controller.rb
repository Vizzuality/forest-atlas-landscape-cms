class StaticPageController < ApplicationController

  # GET /no-permissions
  def no_permissions
  end

  # 404
  # GET /not_found
  def not_found
    puts params
  end
end
