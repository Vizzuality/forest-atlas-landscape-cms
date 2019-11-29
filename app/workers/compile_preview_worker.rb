class CompilePreviewWorker
  include Sidekiq::Worker

  def perform(user_id, site_id, site_settings)
    site = Site.find_by(id: site_id)
    return unless site

    # Compile the preview of the site
    processed_site_settings = JSON.parse(site_settings)
    site.compile_css(true, processed_site_settings)

    # Notify the user when the preview has finished
    ActionCable.server.broadcast "preview_#{user_id}_channel",
                                 site_id: site_id,
                                 finish: true,
                                 site_settings: site_settings
  end
end
