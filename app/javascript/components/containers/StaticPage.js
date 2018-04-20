import React from 'react';

import PublicContainer from './shared/PublicContainer';
import StaticPages from '../pages/static';

export default class StaticPage extends PublicContainer {
  render() {
    return <StaticPages store={this.store} />;
  }
}
