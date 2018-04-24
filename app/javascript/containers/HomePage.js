import React from 'react';

import PublicContainer from 'containers/shared/PublicContainer';
import Home from 'pages/home';

export default class HomePage extends PublicContainer {
  render() {
    return <Home store={this.store} />;
  }
}
