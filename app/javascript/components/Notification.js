import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Notification extends React.Component {
  componentDidMount() {
    this.setFocus();
    if (this.props.autoCloseTimer !== -1) {
      this.timer = setTimeout(this.props.onClose, this.props.autoCloseTimer * 1000);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  /**
   * Set the focus on the continuer or close button
   */
  setFocus() {
    if (this.continueButton) {
      this.continueButton.focus();
    } else if (this.closeButton) {
      this.closeButton.focus();
    }
  }

  render() {
    return (
      <div
        className={classnames({
          'c-notification': true,
          [`-${this.props.type}`]: true,
          '-visible': true,
          '-dialog': this.props.dialogButtons
        })}
        role="alert"
        aria-label={this.props.type}
        aria-describedby="notification-content"
      >
        <div className="wrapper">
          {this.props.additionalContent && (
            <p id="notification-content">
              <strong>{this.props.content}</strong>
              <br />
              {this.props.additionalContent}
            </p>
          )}
          {!this.props.additionalContent && (
            <p id="notification-content">
              {this.props.content}
            </p>
          )}
          {this.props.dialogButtons && (
            <div className="dialog-buttons">
              <button
                type="button"
                className="c-button -monochrome -outline"
                onClick={this.props.onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="c-button -monochrome"
                onClick={this.props.onContinue}
                ref={(el) => { this.continueButton = el; }}
              >
                Continue
              </button>
            </div>
          )}
          {this.props.closeable && (
            <button
              className="close-button"
              aria-label="Close"
              title="Close"
              tabIndex="0"
              onClick={this.props.onClose}
              ref={(el) => { this.closeButton = el; }}
            >
              <svg viewBox="0 0 25 25"><path d="M 5 19 L 19 5 L 21 7 L 7 21 L 5 19 ZM 7 5 L 21 19 L 19 21 L 5 7 L 7 5 Z" /></svg>
            </button>
          )}
        </div>
      </div>
    );
  }
}

Notification.propTypes = {
  /**
   * Type of notification
   */
  type: PropTypes.oneOf(['success', 'warning', 'error']),
  /**
   * Content of the notification, HTML will not be interpreted
   */
  content: PropTypes.string.isRequired,
  /**
   * If not empty, the main content will be highlighted and this will be put below;
   * again, no HTML
   */
  additionalContent: PropTypes.string,
  /**
   * Whether the notification can be closed by the user
   */
  closeable: PropTypes.bool,
  /**
   * Time for the notification to close automatically in seconds
   * Set the value -1 to disable the feature
   * Shouldn't be less than 5 (for accessibility)
   */
  autoCloseTimer: PropTypes.number,
  /**
   * Whether to show the dialog buttons or not
   */
  dialogButtons: PropTypes.bool,
  /**
   * Callback executed when the user clicks the cancel button of the dialog
   */
  onCancel: PropTypes.func,
  /**
   * Callback executed when the user clicks the continue button of the dialog
   */
  onContinue: PropTypes.func,
  /**
   * Callback executed when the user clicks the close button of the dialog
   */
  onClose: PropTypes.func.isRequired
};

Notification.defaultProps = {
  type: 'success',
  additionalContent: '',
  closeable: true,
  autoCloseTimer: -1,
  dialogButtons: false,
  onCancel: () => {},
  onContinue: () => {}
};

export default Notification;
