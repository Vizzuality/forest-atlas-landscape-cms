import React, { Component } from 'react';
import { render } from 'react-dom'

import PublicContainer from './shared/PublicContainer';
import Home from '../pages/home';

export default class HomePage extends PublicContainer {
  render() {
    return <Home store={this.store} />;
  }
}
