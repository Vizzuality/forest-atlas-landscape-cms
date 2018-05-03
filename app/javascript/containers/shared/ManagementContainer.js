import React, { Component } from 'react';
import { Provider } from 'react-redux';

import PropTypes from 'prop-types';

import configureStore from '../../store/configureStore';

import { setEnvVars } from '../../redactions/env';

const store = configureStore();

/*
  Container for any management site, this will include any data thats
  required for our management pages
*/

class ManagementContainer extends Component {
  constructor(props) {
    super(props);
    this.store = store;
  }

  componentWillMount() {
    if (window.gon && 'global' in window.gon) {
      store.dispatch(setEnvVars());
    }
  }

  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

ManagementContainer.propTypes = {
  children: PropTypes.object.isRequired
};

export default ManagementContainer;
