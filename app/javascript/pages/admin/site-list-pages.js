import React from 'react';
import PropTypes from 'prop-types';

import { Table } from 'components';

const SiteListPages = ({ pages }) => (
  <div className="l-page-list">
    <div className="wrapper">
      <Table
        name="List of pages"
        searchable
        columns={['Title', 'Url', 'Type']}
        data={pages}
        actions={['toggle', 'edit', 'delete']}
      />
    </div>
  </div>
);

SiteListPages.propTypes = {
  pages: PropTypes.array.isRequired
};

export default SiteListPages;
