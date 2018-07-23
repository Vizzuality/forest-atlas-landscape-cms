import React from 'react';

import AdminContainer from 'containers/shared/AdminContainer';
import OpenContentPreview from 'pages/admin/open-content-preview';

export default class OpenContentPage extends AdminContainer {
  render() {
    return <OpenContentPreview store={this.store} />;
  }
}
