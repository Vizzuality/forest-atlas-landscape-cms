import React from 'react';

import PublicContainer from 'containers/shared/PublicContainer';
import StaticPages from 'pages/static';

const StaticPageContainer = props => (
  <PublicContainer {...props}>
    <StaticPages />
  </PublicContainer>
);

export default StaticPageContainer;
