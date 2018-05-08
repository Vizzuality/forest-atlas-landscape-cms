import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { CoverPage, WysiwygEditor, Footer } from 'components';

import { getDbContent } from 'utils';

const StaticPage = ({ site }) => (
  <div className="fa-page">
    <CoverPage site={site} secondary />
    <WysiwygEditor content={getDbContent(site.page.content)} />
    <Footer site={site} />
  </div>
);

function mapStateToProps(state) {
  return { site: state.site };
}

StaticPage.propTypes = { site: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(StaticPage);
