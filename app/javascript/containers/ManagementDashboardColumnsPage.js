import React from 'react';

import AdminContainer from 'containers/shared/AdminContainer';
import DashboardColumnsPage from 'pages/management/dashboards/DashboardColumnsPage';

export default class ManagementDashboardColumnsPage extends AdminContainer {
  render() {
    return <DashboardColumnsPage {...this.props} />;
  }
}
