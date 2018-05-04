import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components';

export default function Modal({ show, children, onClose }) {
  if (!show) {
    return null;
  }
  return (
    <div className="modal">
      <div className="modal__wrapper">
        <button type="button" className="modal__close" onClick={() => onClose()}>
          <Icon name="icon-close" />
        </button>
        <div className="modal__body">
          {children}
        </div>
      </div>
      <div className="modal__backdrop" onClick={() => onClose()} />
    </div>
  );
}

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired
};
