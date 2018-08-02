import React from 'react';
import PropTypes from 'prop-types';

import { Table, DatasetModal } from 'components';

const Datasets = ({ datasets }) => (
  <div className="l-page-list">
    <div className="wrapper">
      <Table
        searchable
        columns={['Title', 'Contexts', 'Connector', 'Function', 'Tags', 'Status']}
        data={datasets}
        modal={DatasetModal}
        actions={['edit']}
      />
    </div>
  </div>
);


Datasets.propTypes = { datasets: PropTypes.array.isRequired };

export default Datasets;
