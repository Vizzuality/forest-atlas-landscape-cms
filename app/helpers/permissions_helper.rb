module PermissionsHelper
  include AuthHelper

  def ensure_user_can(action)
    unless current_user
      redirect_to_api_gateway_login and return
    end

    unless user_can? action
      flash[:error] = 'You do not have permissions to view this page'
      redirect_to :no_permissions
    end
  end

  def user_can?(action)
    unless current_user
      return false
    end
    case action
      when 'access_admin'
        return current_user_type == 'ADMIN'
      when 'access_management'
        return %w(ADMIN MANAGER).include? current_user_type
      when 'access_publish'
        return %w(ADMIN MANAGER PUBLISH).include? current_user_type
      else
        false
    end
  end

  private

  def current_user
    return false unless session.key?(:current_user) and session[:current_user]['email']

    if not session.key?(:api_validation_ttl) or session[:api_validation_ttl] <= Time.current
      connect = Faraday.new(url: "#{ENV['API_URL']}") do |faraday|
        faraday.request :url_encoded # form-encode POST params
        faraday.response :logger # log requests to STDOUT
        faraday.adapter Faraday.default_adapter # make requests with Net::HTTP
      end

      connect.authorization :Bearer, session[:user_token]
      response = connect.get('/auth/check-logged');
      user_data = JSON.parse response.body

      session[:current_user] = user_data
      session[:api_validation_ttl] = Time.now + Rails.configuration.session_revalidate_timer
    end

    email = session[:current_user]['email']
    user = User.find_by!(:email => email)
    session[:current_user]['cms_role'] = user.role if user
    return user
  end

  def current_user_type
    session[:current_user]['cms_role']
  end
end
