class ContactController < ApplicationController
  require 'sendgrid-ruby'
  include SendGrid
  require 'nokogiri'
  
  def send_contact_email
    user_name = Nokogiri::HTML(params["user_name"]).text
    user_email = Nokogiri::HTML(params["user_email"]).text
    subject = Nokogiri::HTML(params["subject"]).text
    message = Nokogiri::HTML(params["message"]).text

    from = Email.new(email: 'landscaperestoration2018@gmail.com')
    to = Email.new(email: 'landscaperestoration2018@gmail.com')

    mail_subject = "Restoration Opportunities Atlas - Message - #{subject}"

    mail_message = "\n Name: #{user_name} \n \n Email: #{user_email} \n \n Subject: #{subject} \n \n Message: #{message}"

    content = Content.new(type: 'text/plain', value: mail_message)

    mail = Mail.new(from, mail_subject, to, content)

    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    response = sg.client.mail._('send').post(request_body: mail.to_json)

    flash[:notice] = "Thank you for reaching out to us!"
    redirect_to request.base_url + "/about/contact"
  end

  def send_feedback
    user_name = Nokogiri::HTML(params["user_name"]).text
    user_email = Nokogiri::HTML(params["user_email"]).text
    subject = Nokogiri::HTML(params["subject"]).text
    message = Nokogiri::HTML(params["message"]).text

    from = Email.new(email: Nokogiri::HTML(params["to"]).text)
    to = Email.new(email: Nokogiri::HTML(params["to"]).text)

    mail_subject = "Restoration Opportunities Atlas - Message - #{subject}"

    mail_message = "\n Name: #{user_name} \n \n Email: #{user_email} \n \n Subject: #{subject} \n \n Message: #{message}"

    content = Content.new(type: 'text/plain', value: mail_message)

    mail = Mail.new(from, mail_subject, to, content)

    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    response = sg.client.mail._('send').post(request_body: mail.to_json)

    if response.status_code == "202"
      flash[:notice] = 'Thank you for reaching out to us!'
    else
      flash[:error] = 'There was a problem with your contact. Please try again later.'
    end
    redirect_to request.base_url + "/feedback"
  end
end
