import React from 'react';

import PublicContainer from 'containers/shared/PublicContainer';

import { Table } from 'components';

export default class PublicTableView extends PublicContainer {
  render() {
    const { dashboard } = this.props;
    return <Table data={dashboard ? dashboard.data : []} searchable={false} />;
  }
}
