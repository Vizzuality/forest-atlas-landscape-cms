module UserTokenHelper
  include PermissionsHelper

  def user_token(site, force_admin = false)
    return unless current_user

    if current_user.admin
      # User token for admin permits all operations
      session[:user_token]
    elsif user_site_admin?(site.id) || force_admin
      # If current user is site admin, permits operations without depending of the owner
      admin_user_token
    else
      # If current user is not site admin, only permit on his/her own resources
      session[:user_token]
    end
  end

  private

  def admin_user_token
    @admin_user_token ||= AuthService.login(
      ENV['ADMIN_USER_EMAIL'],
      ENV['ADMIN_USER_PASSWORD']
    ).dig('data', 'token')
  end
end
