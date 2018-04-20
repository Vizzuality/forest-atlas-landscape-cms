import React, { Component } from 'react';
import { Provider } from 'react-redux';

import PropTypes from 'prop-types';

import configureStore from '../../store/configureStore';

import { setPages, setDatasets, setWidgets, setSites, setUsers, setMaps, setMeta } from '../../redactions/admin';

const store = configureStore();

/*
  Container for any admin site, this will include any data thats required for our admin pages
*/

class AdminContainer extends Component {
  constructor(props) {
    super(props);
    this.store = store;
  }
  componentWillMount() {
    const { props } = this;

    if ('meta' in props) {
      store.dispatch(setMeta(props.meta));
    }

    if ('pages' in props) {
      store.dispatch(setPages(props.pages));
    }

    if ('datasets' in props) {
      store.dispatch(setDatasets(props.datasets));
    }

    if ('widgets' in props) {
      store.dispatch(setWidgets(props.widgets));
    }

    if ('sites' in props) {
      store.dispatch(setSites(props.sites));
    }

    if ('users' in props) {
      store.dispatch(setUsers(props.users));
    }

    if ('maps' in props) {
      store.dispatch(setMaps(props.maps));
    }

  }
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

AdminContainer.propTypes = { children: PropTypes.array };

export default AdminContainer;
