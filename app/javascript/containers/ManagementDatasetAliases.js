import React from 'react';
import PropTypes from 'prop-types';

import ManagementContainer from 'containers/shared/ManagementContainer';

const ManagementDatasetAliases = ({ columns }) => (
  <ManagementContainer>
    <div className="l-dataset-creation -aliases">
      <div className="wrapper">
        <div className="c-inputs-container -large">
          <div className="container -flex">
            {columns.map((column, index) => (
              <div key={column.name} className="row">
                <div className="column column-3">
                  <label htmlFor={`dataset-metadata-name-${index}`}>
                    Column name
                  </label>
                  <input type="text" id={`dataset-metadata-name-${index}`} name={`columns[${column.name}][name]`} defaultValue={column.name || ''} disabled />
                </div>
                <div className="column column-3">
                  <label htmlFor={`dataset-metadata-alias-${index}`}>
                    Alias
                  </label>
                  <input type="text" id={`dataset-metadata-alias-${index}`} name={`columns[${column.name}][alias]`} defaultValue={column.alias || ''} placeholder="No alias" />
                </div>
                <div className="column column-3">
                  <label htmlFor={`dataset-metadata-description-${index}`}>
                    Description
                  </label>
                  <textarea id={`dataset-metadata-description-${index}`} name={`columns[${column.name}][description]`} defaultValue={column.description || ''} placeholder="Empty description" />
                </div>
              </div>
            ))}
          </div>
        </div>
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
