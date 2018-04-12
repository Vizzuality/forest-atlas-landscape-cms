import React, { Component } from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';

import { setSite, setPage, setMeta, setSiteSettings } from '../pages/public-site/public-site-actions';

import PublicSite from '../pages/public-site';

const store = configureStore();

export default class Public extends Component {
  componentWillMount() {

    console.log('public container', this.props);

    store.dispatch(setSite(this.props.site));
    store.dispatch(setPage(this.props.page));
    store.dispatch(setMeta({
      image: this.props.image,
      pageSize: this.props.pageSize,
      siteTitleOnly: this.props.siteTitleOnly
    }));

    store.dispatch(setSiteSettings(this.props.siteSettings));
  }
  render() {
    return (
      <Provider store={store}>
        <PublicSite />
      </Provider>
    );
  }
}
