import React from 'react';
import PropTypes from 'prop-types';

// Components
import Modal from 'components/Modal';

class LinkHandler extends React.Component {
  constructor(props) {
    super(props);

    this.quill = props.quill;
    this.onClickClose = this.onClickClose.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
    this.onChangeUrl = this.onChangeUrl.bind(this);
    this.onChangeTarget = this.onChangeTarget.bind(this);

    this.state = this.getInitialState();
  }

  /**
   * Return the initial state of the component
   */
  getInitialState() {
    const { index, length } = this.quill.getSelection();
    const formats = this.quill.getFormat(index, length)
    return {
      selection: this.quill.getText(index, length),
      href: (formats && formats.link
        && (typeof formats.link === 'string' ? formats.link : formats.link.href))
        || '',
      newtab: (formats && formats.link
        && (typeof formats.link === 'string' ? true : (formats.link.target === '_blank')))
        || false
    };
  }

  /**
   * Event handler executed when the user closes
   * the modal
   */
  onClickClose() {
    const { onClose } = this.props;
    onClose();
  }

  /**
   * Event handler executed when the user saves
   */
  onClickSave() {
    const { href, newtab } = this.state;

    // We save the link info
    this.quill.format('link', false); // Without this, the link is not updated properly
    this.quill.format('link', {
      href,
      target: newtab ? '_blank' : '_self'
    })

    // We close the modal
    this.onClickClose();
  }

  /**
   * Event handler executed when the user wants to
   * remove the link from the text
   */
  onClickRemove() {
    // We remove the link format
    this.quill.format('link', false);

    // We close the modal
    this.onClickClose();
  }

  /**
   * Event handler executed when the user changes
   * the URL of the link
   */
  onChangeUrl({ target }) {
    this.setState({ href: target.value });
  }

  /**
   * Event handler executed when the user changes
   * the target of the link
   */
  onChangeTarget({ target }) {
    this.setState({ newtab: target.checked });
  }

  render() {
    const { selection, href, newtab } = this.state;

    return (
      <Modal show onClose={this.onClickClose}>
        <div className="c-link-handler">
          <h1>Link for "{selection}"</h1>
          <div className="c-inputs-container">
            <div className="container">
              <label htmlFor="link-handler-url">URL</label>
              <input type="url" name="url" id="link-hanlder-url" value={href} placeholder="https://www.example.com" onChange={this.onChangeUrl} />
            </div>
            <div className="container">
              <div className="c-checkbox">
                <input type="checkbox" name="tab" id="link-handler-tab" checked={newtab} onChange={this.onChangeTarget} />
                <label htmlFor="link-handler-tab">Open in a separate tab</label>
              </div>
            </div>
            <footer>
              <button type="button" className="c-button -outline -dark-text" onClick={this.onClickRemove}>
                Remove link
              </button>
              <button type="button" className="c-button" onClick={this.onClickSave}>
                Save
              </button>
            </footer>
          </div>
        </div>
      </Modal>
    );
  }
}

LinkHandler.propTypes = {
  // Quill reference
  quill: PropTypes.any.isRequired,
  // Callback for when the handler is closed
  onClose: PropTypes.func.isRequired
};

export default LinkHandler;
