import React from 'react';

import AdminContainer from 'containers/shared/AdminContainer';
import MigrateHomepage from 'pages/admin/migrate-homepage';

export default class OpenContentPage extends AdminContainer {
  render() {
    return <MigrateHomepage store={this.store} />;
  }
}
