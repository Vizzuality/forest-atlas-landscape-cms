import React, { Component } from 'react';
import { render } from 'react-dom'

import AdminContainer from './shared/AdminContainer';
import Datasets from '../pages/admin/datasets';

export default class DatasetsPage extends AdminContainer {
  render() {
    return <Datasets store={this.store} />;
  }
}
