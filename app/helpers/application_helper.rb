module ApplicationHelper
  def current_class(*controller)
    controller.include?(params[:controller]) ? 'active ' : ''
  end

  def page_link(page)
    href = page.content_type.equal?(ContentType::LINK) ? page.content['url'] : page.url
    target_blank = 'target="_blank"' if page.content_type.equal?(ContentType::LINK) and page.content['target_blank'].eql? '1'
    "<a href=\"#{ href }\" #{ target_blank }>#{ page.name }</a>".html_safe
  end

  def ensure_user_type(user_type)
    if current_user
      unless current_user_type == user_type.upcase
        flash[:error] = 'You do not have permissions to view this page'
        redirect_to :no_permissions
      end
    else
      redirect_to_api_gateway
    end
  end

  # TODO : This hack is to guarantee for now that the header is show in admin
  def user_signed_in?
    current_user_type == 'ADMIN'
  end

  private

  def current_user
    if session.key?('current_user')
      connect = Faraday.new(url: "#{ENV['API_URL']}") do |faraday|
        faraday.request  :url_encoded             # form-encode POST params
        faraday.response :logger                  # log requests to STDOUT
        faraday.adapter  Faraday.default_adapter  # make requests with Net::HTTP
      end

      connect.authorization :Bearer, session[:user_token]
      response = connect.get('/auth/check-logged');

      session[:current_user] = response.body
    else
      return false
    end
  end

  def current_user_type
    return 'ADMIN'

    # TODO Should implement a local user management system with different roles
    # (use a decorator on the user that is sent by the API)

    #if session['current_user']
    #  user = JSON.parse session['current_user']
    #  return user['role']
    #end
  end

  def redirect_to_api_gateway
    redirect_to "#{ENV['API_URL']}/auth?callbackUrl=#{auth_login_url}&token=true"
  end
end
