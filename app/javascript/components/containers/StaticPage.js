import React, { Component } from 'react';
import { render } from 'react-dom'

import PublicContainer from './shared/PublicContainer';
import StaticPages from '../pages/static';

export default class StaticPage extends PublicContainer {
  render() {
    return <StaticPages { ...this.store.getState() } />;
  }
}
