import React from 'react';
import PropTypes from 'prop-types';

import AdminContainer from 'containers/shared/AdminContainer';
import EditDashboard from 'pages/admin/edit-dashboard';

function EditDashboardPage(props) {
  return (
    <AdminContainer>
      <EditDashboard {...props} />
    </AdminContainer>
  );
}

EditDashboardPage.propTypes = {
  dataset: PropTypes.string.isRequired,
  widget: PropTypes.string.isRequired,
  topContent: PropTypes.string,
  bottomContent: PropTypes.string
};

EditDashboardPage.defaultProps = {
  topContent: '',
  bottomContent: ''
};

export default EditDashboardPage;
