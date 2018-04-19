import React, { Component } from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux';
import configureStore from '../../store/configureStore';

import { setPages, setDatasets } from '../../redactions/admin';

const store = configureStore();

/*
  Container for any admin site, this will include any data thats required for our admin pages
*/

export default class AdminContainer extends Component {
  constructor(props) {
    super(props);
    this.store = store;
  }
  componentWillMount() {
    const { props } = this;

    if ('pages' in props) {
      store.dispatch(setPages(props.pages));
    }

    if ('datasets' in props) {
      store.dispatch(setDatasets(props.datasets));
    }

  }
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}
