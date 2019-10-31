module SpecTestHelper
  def sign_in(user)
    session[:api_validation_ttl] = Time.now + 1.day
    session[:current_user] = {}
    session[:current_user][:email] = user.email
  end
end

RSpec.configure do |config|
  config.include SpecTestHelper, type: :controller
end
