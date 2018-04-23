import React from 'react';

import PublicContainer from './shared/PublicContainer';

import { Table } from '../shared';

export default class PublicTableView extends PublicContainer {
  render() {
    return <Table data={this.props.dashboard.data} searchable={false} />;
  }
}
