class ContactController < ApplicationController
  require 'sendgrid-ruby'
  include SendGrid
  
  def send_contact_email
    user_name = params["user_name"]
    user_email = params["user_email"]
    subject = params["subject"]
    message = params["message"]


	from = Email.new(email: 'landscapes@wri.org')
	to = Email.new(email: 'landscapes@wri.org')
	
	mail_subject = "Restoration Opportunities Atlas - Message - #{subject}"

	mail_message = "\n \n Name: #{user_name} \n \n Email: #{user_email} \n \n Subject: #{subject} \n \n Message: #{message}"

	content = Content.new(type: 'text/plain', value: mail_message)

	mail = Mail.new(from, mail_subject, to, content)

	sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
	response = sg.client.mail._('send').post(request_body: mail.to_json) 

    flash[:notice] = "Thank you for reaching out to us!"
    redirect_to request.base_url + "/about/contact"
  end
end