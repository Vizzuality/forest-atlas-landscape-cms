import React, { Component } from 'react';
import { render } from 'react-dom'

import AdminContainer from './shared/AdminContainer';
import EditWidget from '../pages/admin/widget';

export default class EditWidgetPage extends AdminContainer {
  render() {
    return <EditWidget store={this.store} />;
  }
}
