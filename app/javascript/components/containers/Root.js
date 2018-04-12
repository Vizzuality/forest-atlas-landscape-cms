import React, { Component } from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux';
import Site from './Site';
import configureStore from '../store/configureStore';
import { setSite, setPage, setMeta } from '../actions/site'

const store = configureStore();

export default class Root extends Component {
  componentWillMount() {
    store.dispatch(setSite(this.props.site));
    store.dispatch(setPage(this.props.page));
    store.dispatch(setMeta({
      image: this.props.image,
      pageSize: this.props.pageSize,
      siteTitleOnly: this.props.siteTitleOnly
    }));
  }
  render() {
    return (
      <Provider store={store}>
        <Site />
      </Provider>
    );
  }
}
