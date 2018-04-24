import React from 'react';

import PublicContainer from 'containers/shared/PublicContainer';

import { Table } from 'components';

export default class PublicTableView extends PublicContainer {
  render() {
    return <Table data={this.props.dashboard.data} searchable={false} />;
  }
}
