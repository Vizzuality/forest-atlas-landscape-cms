import React from 'react';

import AdminContainer from 'containers/shared/AdminContainer';
import TableView from 'pages/admin/table-view';

export default class AdminTableView extends AdminContainer {
  render() {
    return <TableView store={this.store} />;
  }
}
