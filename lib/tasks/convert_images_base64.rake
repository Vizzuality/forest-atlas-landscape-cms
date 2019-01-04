namespace :images do
  desc "Converts all the images from base 64 to files"
  task convert: :environment do
    Paperclip::DataUriAdapter.register
    SitePage.find_each do |page|
      images = page.content.scan(/"(data:image[^"]*)/)
      images.each do |image|
        base64 = image.first
        file_image_url = ContentImage.create_from_base64 page.id, base64
        page.content.gsub!(base64, file_image_url)
      end
      page.save!
    end
  end
end
