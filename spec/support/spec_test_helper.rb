module SpecTestHelper
  def sign_in(user, test_session = session)
    test_session[:api_validation_ttl] = Time.now + 1.day
    test_session[:current_user] = {}
    test_session[:current_user][:email] = user.email
  end
end

RSpec.configure do |config|
  config.include SpecTestHelper, type: :controller
end
