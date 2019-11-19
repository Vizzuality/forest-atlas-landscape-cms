class CompilePreviewWorker
  include Sidekiq::Worker

  def perform(user_id, site_id)
    site = Site.find_by(id: site_id)
    return unless site

    # Compile the preview of the site
    site.compile_css(true)

    # Notify the user when the preview has finished
    ActionCable.server.broadcast "preview_#{user_id}_channel",
                                 site_id: site_id,
                                 finish: true
  end
end
