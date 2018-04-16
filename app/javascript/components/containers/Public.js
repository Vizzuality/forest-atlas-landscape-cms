import React, { Component } from 'react';
import { render } from 'react-dom'

import PublicContainer from './shared/PublicContainer';

import PublicSite from '../pages/public-site';

export default class Public extends PublicContainer {
  render() {
    return <PublicSite store={this.store} />;
  }
}
