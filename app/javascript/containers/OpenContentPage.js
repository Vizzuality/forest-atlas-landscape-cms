import React from 'react';

import AdminContainer from 'containers/shared/AdminContainer';
import OpenContent from 'pages/admin/open-content';

export default class OpenContentPage extends AdminContainer {
  render() {
    return <OpenContent store={this.store} />;
  }
}
