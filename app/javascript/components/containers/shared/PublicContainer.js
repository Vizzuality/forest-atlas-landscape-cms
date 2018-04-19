import React, { Component } from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux';
import configureStore from '../../store/configureStore';

import { setSite, setPage, setMeta, setSiteSettings } from '../../redactions/site';

const store = configureStore();

/*
  Container for any public site, this will include any data thats required for our public pages
  remember when extending this to include the store in your page.
*/

export default class PublicContainer extends Component {
  constructor(props) {
    super(props);
    this.store = store;
  }
  componentWillMount() {
    const { props } = this;

    store.dispatch(setSite(props.site));
    store.dispatch(setPage(props.page));
    store.dispatch(setMeta({
      image: props.image,
      pageSize: props.pageSize,
      siteTitleOnly: props.siteTitleOnly
    }));
    store.dispatch(setSiteSettings(props.siteSettings));
  }
  render() {
    return <Provider store={store}>{props.children}</Provider>;
  }
}
