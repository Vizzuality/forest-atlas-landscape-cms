import React, { Component } from 'react';
import { render } from 'react-dom'

import AdminContainer from './shared/AdminContainer';
import SiteListPages from '../pages/admin/site-list-pages';

export default class SitePages extends AdminContainer {
  render() {
    return <SiteListPages store={this.store} />;
  }
}
