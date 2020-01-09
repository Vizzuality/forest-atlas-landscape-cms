module SiteSteps
  module ShowLogic
    class ContentStep
      include Interactor

      def call
        site = context.site
        SiteSetting.create_additional_settings site

        main_images = site.site_settings.where(name: 'main_image').order(position: :asc)
        context.set_variables = {
          logo_image: site.site_settings.find { |ss| ss.name == 'logo_image' },
          main_images: main_images,
          alternative_image: site.
            site_settings.
            find { |ss| ss.name == 'alternative_image' },
          favico: site.site_settings.find { |ss| ss.name == 'favico' }
        }

        gon = context.gon
        gon.global.main_images =
          main_images.map { |x| x.attributes.merge!(image_url: x.image.url) }
      end
    end
  end
end
