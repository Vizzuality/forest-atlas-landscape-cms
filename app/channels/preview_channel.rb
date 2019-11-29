class PreviewChannel < ApplicationCable::Channel
  def subscribed
    stream_from "preview_#{current_user.id}_channel"
  end

  def unsubscribed; end
end
