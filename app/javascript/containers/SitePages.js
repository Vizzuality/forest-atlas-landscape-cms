import React from 'react';
import PropTypes from 'prop-types';

import AdminContainer from 'containers/shared/AdminContainer';
import SiteListPages from 'pages/admin/site-list-pages';

class SitePages extends React.Component {
  render() {
    return (
      <AdminContainer>
        <SiteListPages pages={this.props.pages} />
      </AdminContainer>
    );
  }
}

SitePages.propTypes = {
  pages: PropTypes.array
};

SitePages.defaultProps = {
  pages: []
};

export default SitePages;
