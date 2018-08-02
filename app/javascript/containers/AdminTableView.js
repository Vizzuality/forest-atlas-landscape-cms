import React from 'react';
import PropTypes from 'prop-types';

import AdminContainer from 'containers/shared/AdminContainer';
import TableView from 'pages/admin/table-view';

class AdminTableView extends React.Component {
  render() {
    return (
      <AdminContainer>
        <TableView meta={this.props.meta} data={this.props.data} />
      </AdminContainer>
    );
  }
}

AdminTableView.propTypes = {
  meta: PropTypes.object.isRequired,
  data: PropTypes.array
};

AdminTableView.defaultProps = {
  data: []
};

export default AdminTableView;
