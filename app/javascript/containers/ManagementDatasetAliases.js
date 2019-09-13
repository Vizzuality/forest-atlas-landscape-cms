import React from 'react';
import PropTypes from 'prop-types';

import ManagementContainer from 'containers/shared/ManagementContainer';

const ManagementDatasetAliases = ({ columns }) => (
  <ManagementContainer>
    <div className="l-dataset-creation -aliases">
      <div className="wrapper">
        {columns.map(column => (
          <fieldset key={column.name} className="c-inputs-container">
            <legend>{column.name}</legend>
            <div className="container">
              <label htmlFor="dataset-metadata-alias">
                Alias
              </label>
              <input type="text" id="dataset-metadata-alias" name={`columns[${column.name}][alias]`} defaultValue={column.alias || ''} />
            </div>
            <div className="container">
              <label htmlFor="dataset-metadata-description">
                Description
              </label>
              <textarea id="dataset-metadata-description" name={`columns[${column.name}][description]`} defaultValue={column.description || ''} />
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  </ManagementContainer>
);

ManagementDatasetAliases.propTypes = {
  /**
   * List of columns with their aliases and descriptions
   */
  columns: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    alias: PropTypes.string,
    description: PropTypes.string,
  })).isRequired,
};

export default ManagementDatasetAliases;
