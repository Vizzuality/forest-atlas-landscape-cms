import React from 'react';
import PropTypes from 'prop-types';

import { Table, DatasetModal } from 'components';

const Datasets = ({ datasets }) => (
  <div className="l-page-list">
    <div className="wrapper">
      <Table
        searchable
        columns={['title', 'contexts', 'connector', 'function', 'tags', 'status']}
        data={datasets}
        modal={DatasetModal}
        actions={['edit']}
      />
    </div>
  </div>
);


Datasets.propTypes = { datasets: PropTypes.array.isRequired };

export default Datasets;
