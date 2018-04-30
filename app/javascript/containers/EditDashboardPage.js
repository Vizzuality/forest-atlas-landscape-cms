import React from 'react';

import AdminContainer from 'containers/shared/AdminContainer';
import EditDashboard from 'pages/admin/edit-dashboard';

export default class EditDashboardPage extends AdminContainer {
  render() {
    return <EditDashboard store={this.store} />;
  }
}
