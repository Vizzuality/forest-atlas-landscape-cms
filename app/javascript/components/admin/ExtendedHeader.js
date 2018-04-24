import React from 'react';
import PropTypes from 'prop-types';

export default function ExtendedHeader({ title, subTitle }) {
  return (
    <div className="c-extended-header">
      <div className="wrapper">
        <div className="description">
          <h1>{title}</h1>
          {subTitle && <p>{subTitle}</p>}
        </div>
      </div>
    </div>
  );
}

ExtendedHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired
};
