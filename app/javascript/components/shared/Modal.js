import React from "react"
import PropTypes from "prop-types"

import { Icon } from '../shared'

export default function Modal({ show, children }) {
  if (!show) {
    return null;
  }
  return (
    <div className="modal">
      <div className="modal__body">
        <button type="button" className="modal__close">
          <Icon name="icon-close" />
        </button>
        {children}
      </div>
      <div className="modal__backdrop"></div>
    </div>
  );
}

Modal.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string
};
