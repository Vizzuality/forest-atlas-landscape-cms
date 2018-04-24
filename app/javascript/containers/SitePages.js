import React from 'react';

import AdminContainer from 'containers/shared/AdminContainer';
import SiteListPages from 'pages/admin/site-list-pages';

export default class SitePages extends AdminContainer {
  render() {
    return <SiteListPages store={this.store} />;
  }
}
