import React from 'react';

import PublicContainer from './shared/PublicContainer';

import { Table, Widget } from '../shared';

export default class Dashboard extends PublicContainer {
  render() {
    return (
      <div>
        <Widget data={this.props.dashboard.data} />
        <Table data={this.props.dashboard.data} searchable={false} />
      </div>);
  }
}
