import React from 'react';
import PropTypes from 'prop-types';

class Confirm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirm: false
    };
  }

  onConfirm() {
    this.setState({ confirm: true });
  }

  render() {
    const { msg, link } = this.props;
    return (
      <div>
        <button
          onClick={() => this.onConfirm()}
          data-method="delete"
          className="c-table-action-button -delete"
          title="Delete"
        >
          Delete
        </button>

        {this.state.confirm &&
        <div className="confirm-delete">
          <h2>{msg || 'Are you sure?'}</h2>

          <div className="options">
            <button onClick={() => this.setState({ confirm: false })}>No</button>

            <a
              href={link || '#'}
              data-method="delete"
              title="Delete"
            >
              Yes
            </a>
          </div>
        </div>}
      </div>);
  }
}

Confirm.propTypes = {
  msg: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
};

export default Confirm;
