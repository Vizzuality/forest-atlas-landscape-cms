import React from 'react';

import AdminContainer from 'containers/shared/AdminContainer';
import Datasets from 'pages/admin/datasets';

export default class DatasetsPage extends AdminContainer {
  render() {
    return <Datasets store={this.store} />;
  }
}
