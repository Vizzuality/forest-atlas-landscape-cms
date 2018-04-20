import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { CoverPage, SiteContent, Footer } from '../shared';

const StaticPage = ({ site }) => (
  <div className="fa-page">
    <CoverPage site={site} secondary />
    <SiteContent content={JSON.parse(site.page.content.json)} />
    <Footer site={site} />
  </div>
);

function mapStateToProps(state) {
  return { site: state.site };
}

StaticPage.propTypes = { site: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(StaticPage);
