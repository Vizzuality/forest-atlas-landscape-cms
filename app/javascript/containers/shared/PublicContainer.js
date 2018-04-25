import React, { Component } from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';

import configureStore from 'store/configureStore';

import { setSite, setPage, setMeta, setSiteSettings } from 'redactions/site';
import { setEnvVars } from 'redactions/env';
import { setDashboardData, setDashboardWidgets } from 'redactions/dashboard';

const store = configureStore();

/*
  Container for any public site, this will include any data thats required for our public pages
  remember when extending this to include the store in your page.
*/

class PublicContainer extends Component {
  constructor(props) {
    super(props);
    this.store = store;
  }

  componentWillMount() {
    const { props } = this;

    if (props.dashboard) {
      store.dispatch(setDashboardData(props.dashboard));
    }

    if (props.widgets) {
      store.dispatch(setDashboardWidgets(props.widgets));
    }

    store.dispatch(setSite(props.site));
    store.dispatch(setPage(props.page));
    store.dispatch(setMeta({
      image: props.image,
      pageSize: props.pageSize,
      siteTitleOnly: props.siteTitleOnly
    }));
    store.dispatch(setSiteSettings(props.siteSettings));

    if (window.gon && 'global' in window.gon) {
      store.dispatch(setEnvVars());
    }
  }

  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

PublicContainer.propTypes = { children: PropTypes.array };

export default PublicContainer;
