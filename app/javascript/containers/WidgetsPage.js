import React from 'react';

import AdminContainer from 'containers/shared/AdminContainer';
import Widgets from 'pages/admin/widgets';

export default class WidgetsPage extends AdminContainer {
  render() {
    return <Widgets store={this.store} />;
  }
}
