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
  dataset: PropTypes.string,
  widget: PropTypes.string,
  topContent: PropTypes.string,
  bottomContent: PropTypes.string
};

EditDashboardPage.defaultProps = {
  topContent: null,
  bottomContent: null,
  widget: null,
  dataset: null
};

export default EditDashboardPage;
