import React from 'react';
import PublicContainer from 'containers/shared/PublicContainer';

import Dashboard from 'pages/dashboard';

export default class DashboardView extends PublicContainer {
  render() {
    return <Dashboard store={this.store} />;
  }
}
