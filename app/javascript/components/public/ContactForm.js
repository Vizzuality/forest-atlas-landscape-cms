import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

class ContactForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      success: location.search === '?success',
      error: location.search === '?error',
    };
  }

  onSubmit(e) {
    if (!e.target.checkValidity()) {
      e.preventDefault();
      this.setState({ submitted: true });
    }
  }

  render() {
    const { submitted, success, error } = this.state;

    return (
      <div className={`c-contact-form ${this.props.className}`}>
        <div className="wrapper">
          {success && (
            <div className="message">
              <h1>Thank you for contact us!</h1>
              <p>We are reviewing your request and will respond soon.</p>
            </div>
          )}
          {error && (
            <div className="message">
              <h1>An error occurred!</h1>
              <p>Please try to contact us again later.</p>
            </div>
          )}
          <form
            action="send-feedback"
            acceptCharset="UTF-8"
            method="post"
            noValidate
            onSubmit={e => this.onSubmit(e)}
          >
            <input type="hidden" name="to" id="to" value={this.props.email} />
            <input type="hidden" name="atlas" id="atlas" value={this.props.site.name} />
            <input type="hidden" name="authenticity_token" value={this.props.authenticityToken}/>
            <div className={classnames({ 'c-inputs-container': true, '-submitted': submitted })}>
              <div className="container">
                <label htmlFor="user_name">Your name *</label>
                <input type="text" name="user_name" id="user_name" placeholder="Paul Smith" required />
              </div>
              <div className="container">
                <label htmlFor="user_email">Your email address *</label>
                <input type="email" name="user_email" id="user_email" placeholder="paul.smith@provider.com" required />
              </div>
              <div className="container">
                <label htmlFor="subject">Subject *</label>
                <input type="text" name="subject" id="subject" placeholder="Data suggestion" required />
              </div>
              <div className="container">
                <label htmlFor="message">Message *</label>
                <textarea name="message" id="message" placeholder="How can we help?" required />
              </div>
              <footer>
                <button type="submit" className="c-button">Send message</button>
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
