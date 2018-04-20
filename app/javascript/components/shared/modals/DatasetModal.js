import React from 'react';
import PropTypes from 'prop-types';

export default function DatasetModal({ value }) {
  const {
    name,
    description,
    language,
    source,
    application
  } = value;

  return (
    <div className="modal__contents">
      <h1>{name}</h1>
      <p>{description}</p>

      <div className="modal__tabledata">
        <dl>
          <dt>Language</dt>
          <dd>{language}</dd>
        </dl>
        <dl>
          <dt>Source</dt>
          <dd>{source}</dd>
        </dl>
        <dl>
          <dt>Application</dt>
          <dd>{application}</dd>
        </dl>
      </div>

    </div>
  );
}

DatasetModal.propTypes = { value: PropTypes.object.isRequired };
