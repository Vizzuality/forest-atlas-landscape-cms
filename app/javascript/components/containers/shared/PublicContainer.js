import React, { Component } from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux';
import configureStore from '../../store/configureStore';

import { setSite, setPage, setMeta, setSiteSettings } from '../../pages/public-site/public-site-actions';

const store = configureStore();

/*
  Container for any public site, this will include any data thats required for our public pages
  These parameters we get from our **gon** object within our rails template files

  remember when extending this to include the store in your page.
*/
export default class PublicContainer extends Component {
  constructor(props) {
    super(props);
    this.store = store;
  }
  componentWillMount() {
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
    return (<Provider store={store}>
      {this.props.children}
    </Provider>)
  }
}
