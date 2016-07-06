class ManagementController < ActionController::Base
  before_action :authenticate_user!
  layout 'management'
end
