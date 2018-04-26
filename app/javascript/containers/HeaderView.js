import React from 'react';

import PublicContainer from 'containers/shared/PublicContainer';
import CoverPage from 'components/CoverPage';

export default class HeaderView extends PublicContainer {
  render() {
    return <CoverPage {...this.store.getState()} secondary />;
  }
}
