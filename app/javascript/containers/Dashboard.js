import React from 'react';

import PublicContainer from 'containers/shared/PublicContainer';

import WidgetDashboard from 'pages/widget-dashboard';

export default class Dashboard extends PublicContainer {
  render() {
    return <WidgetDashboard store={this.store} />;
  }
}
