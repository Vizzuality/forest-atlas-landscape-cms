class Management::WidgetStepsController < ManagementController
  # include Wicked

  def index
    gon.widgets = ''
  end
end
