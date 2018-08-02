import React from 'react';
import PropTypes from 'prop-types';

import AdminContainer from 'containers/shared/AdminContainer';
import Datasets from 'pages/admin/datasets';

class DatasetsPage extends React.Component {
  render() {
    return (
      <AdminContainer>
        <Datasets datasets={this.props.datasets} />
      </AdminContainer>
    );
  }
}

DatasetsPage.propTypes = {
  datasets: PropTypes.array
};

DatasetsPage.defaultProps = {
  datasets: []
};

export default DatasetsPage;
