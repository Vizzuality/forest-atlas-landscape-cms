import React from 'react';

import AdminContainer from 'containers/shared/AdminContainer';
import DashboardColumnsPage from 'pages/management/dashboards/DashboardColumnsPage';

const ManagementDashboardColumnsPage = props => (
  <AdminContainer {...props}>
    <DashboardColumnsPage {...props} />
  </AdminContainer>
);
