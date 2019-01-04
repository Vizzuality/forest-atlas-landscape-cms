class Admin::TemporaryContentImagesController < AdminController

  before_action :ensure_management_user, only: [:destroy]

  def create
    content_image = TemporaryContentImage.new(content_image_params)
    if content_image.save
      render json: { url: content_image.image.url + "&temp_id=#{content_image.id}" }, status: :created
    else
      render_error(content_image, :unprocessable_entity)
    end
  end

  private

  def content_image_params
    params.permit(:image)
  end
end
