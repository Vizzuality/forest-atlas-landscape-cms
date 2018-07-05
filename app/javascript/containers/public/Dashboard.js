import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'store/configureStore';

import Dashboard from 'components/public/Dashboard';

const store = configureStore();

export default () => <Provider store={store}><Dashboard /></Provider>;
