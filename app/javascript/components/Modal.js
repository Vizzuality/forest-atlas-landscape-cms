import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components';

export default function Modal({ show, children, onClose }) {
  if (!show) {
    return null;
  }
  return (
    <div className="modal_react">
      <div className="modal_react__wrapper">
        <button type="button" className="modal_react__close" onClick={() => onClose()}>
          <Icon name="icon-close" />
        </button>
        <div className="modal_react__body">
          {children}
        </div>
      </div>
      <div className="modal_react__backdrop" onClick={() => onClose()} />
    </div>
  );
}

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired
};
