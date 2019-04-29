import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

class ContactForm extends PureComponent {
  render() {
    return (
      <div className={`c-contact-form ${this.props.className}`}>
        <div className="wrapper">
          <form action="send-feedback" acceptCharset="UTF-8" method="post">
            <div className="c-inputs-container">
              <div className="container">
                <label htmlFor="user_name">Your name</label>
                <input type="text" name="user_name" id="user_name" placeholder="Paul Smith" />
              </div>
              <div className="container">
                <label htmlFor="user_email">Your email address</label>
                <input type="text" name="user_email" id="user_email" placeholder="paul.smith@provider.com" />
              </div>
              <div className="container">
                <label htmlFor="subject">Subject</label>
                <input type="text" name="subject" id="subject" placeholder="Data suggestion" />
              </div>
              <div className="container">
                <label htmlFor="message">Message</label>
                <textarea name="message" id="message" placeholder="Hey! I'd like to suggest new data for your dashboard..." />
              </div>
              <footer>
                <button type="submit" className="c-button" data-disable-with="Sending...">Send message</button>
                <input type="hidden" name="to" id="to" value={this.props.email} />
                <input type="hidden" name="authenticity_token" value={this.props.authenticityToken}/>
              </footer>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

ContactForm.propTypes = {
  email: PropTypes.string.isRequired,
  authenticityToken: PropTypes.string.isRequired,
  className: PropTypes.string
};

ContactForm.defaultProps = {
  className: ''
};

export default ContactForm;
