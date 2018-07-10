import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'store/configureStore';

import Dashboard from 'components/shared/Dashboard';

const store = configureStore();

export default props => {
  console.log(props);
  return <Provider store={store}><Dashboard {...props} /></Provider>;
};
