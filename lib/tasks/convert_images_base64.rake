namespace :images do
  desc "Converts all the images from base 64 to files"
  task convert: :environment do
    Paperclip::DataUriAdapter.register
    SitePage.find_each do |page|
      begin
        has_hash_content = page.content.is_a? Hash
        puts "Page: #{page.id}. Hash: #{has_hash_content}"
        page.content = page.content.to_json if has_hash_content
        images = page.content.scan(/"(data:image[^"]*)/)
        images.each do |image|
          base64 = image.first
          file_image_url = ContentImage.create_from_base64 page.id, base64
          if has_hash_content
            page.content.gsub!(base64, file_image_url + '\\')
          else
            page.content.gsub!(base64, file_image_url)
          end
          puts "Updated page #{page.id}. Has_hash_content: #{has_hash_content}"
        end
        page.content = JSON.parse(page.content) if has_hash_content
        page.save!
      rescue Exception => e
        puts "ERROR IN PAGE #{page.id}. #{e.message}"
      end
    end
  end
end
