class Management::DatasetStepsController < ManagementController
  # include Wicked

  def index
    gon.datasets = ''
  end
end
