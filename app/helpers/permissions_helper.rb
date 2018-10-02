module PermissionsHelper
  include AuthHelper

  def ensure_user_can(action)
    unless current_user
      unset_user_gon
      if session[:current_user] && api_validation_ttl?
        gon.global.user = {
          logout: auth_logout_url,
          access_denied: true,
          name: 'ACCESS DENIED', #  TMP to prevent JS errors
          profile: no_permissions_url #  TMP to prevent JS errors
        }

        # No use redirecting to the API login gateway, because this user is already logged in.
        # The CMS does not recognise the login because either login email not in database,
        # or the user logged in via social media login, which is not supported.
        flash[:alert] = if session[:current_user][:email].present?
          'Please verify that the CMS account is set up properly for ' + session[:current_user][:email]
        else
          'Social network login is not supported in the CMS. Please log in with your email address.'
        end
        session.delete(:current_user)
        session.delete(:api_validation_ttl)
        redirect_to :no_permissions and return
      end
      redirect_to_api_gateway_login and return
    end

    unless user_can? action
      flash[:alert] = 'You do not have permissions to view this page'
      redirect_to :no_permissions
    end
  end

  def user_can?(action)
    unless current_user
      return false
    end
    case action
    when 'access_admin_only'
      return current_user_is_admin
    when 'access_admin'
      return current_user_is_admin || current_user_has_roles([UserType::ADMIN])
    when 'access_management'
      return current_user_is_admin || current_user_has_roles([UserType::MANAGER])
    when 'access_publish'
      return current_user_is_admin || current_user_has_roles([UserType::MANAGER, UserType::PUBLISHER])
    else
      false
    end
  end

  def user_site_manager?(site)
    return false unless current_user && site
    if current_user_is_admin || (site.users.exists?(current_user) &&
      current_user.user_site_associations.find_by(site_id: site.id).role == UserType::MANAGER)
      return true
    else
      return false
    end
  end

  def user_site_admin?(site_id)
    return false unless current_user
    # Tests new sites
    return false if site_id.nil? && !current_user_is_admin
    # Tests existing sites
    return false unless current_user_is_admin ||
      current_user.owned_sites.pluck(:site_id).include?(site_id)
    true
  end

  def unset_user_gon
    gon.global.admin = false
    gon.global.user = {}
  end

  def set_user_gon
    unset_user_gon and return unless current_user

    @user = current_user
    gon.global.admin = current_user.admin

    # maybe find a more logical place for this
    gon.global.api_url = ENV['API_URL']
    gon.global.api_env = ENV['API_ENV']
    gon.global.api_applications = ENV['API_APPLICATIONS']
    gon.global.control_tower_url = ENV['CONTROL_TOWER_URL']

    gon.global.user = {
      name: current_user.name,
      token: session[:user_token],
      profile: edit_management_profile_path(current_user.id),
      logout: auth_logout_url
    }
  end

  private

  def api_validation_ttl?
    session[:api_validation_ttl] && session[:api_validation_ttl] > Time.current
  end

  def current_user
    if !api_validation_ttl?
      return nil unless session[:user_token] && ensure_logged_in
    end
    return nil unless session[:current_user]
    email = session[:current_user][:email]
    user = email && User.find_by(email: email)
    if user
      session[:current_user][:admin] = user.admin
      session[:current_user][:roles] = user.roles
    else
      session.delete(:user_token)
    end
    return user
  end

  def current_user_is_admin
    session[:current_user][:admin]
  end

  def current_user_has_roles(roles)
    (session[:current_user][:roles] & roles).any?
  end
end
