import React from 'react';

import AdminContainer from 'containers/shared/AdminContainer';
import EditWidget from 'pages/admin/widget';

export default class EditWidgetPage extends AdminContainer {
  render() {
    return <EditWidget store={this.store} />;
  }
}
