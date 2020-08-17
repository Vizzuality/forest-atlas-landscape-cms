import React from 'react';

import AdminContainer from 'containers/shared/AdminContainer';
import OpenContent from 'pages/admin/open-content';

const OpenContentPage = props => (
  <AdminContainer {...props}>
    <OpenContent />
  </AdminContainer>
);

export default OpenContentPage;
