import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { CoverPage, WysiwygEditor, Footer } from 'components';

const StaticPage = ({ site }) => (
  <div className="fa-page">
    <CoverPage site={site} secondary />
    <WysiwygEditor content={JSON.parse(site.page.content.json)} />
    <Footer site={site} />
  </div>
);

function mapStateToProps(state) {
  return { site: state.site };
}

StaticPage.propTypes = { site: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(StaticPage);
