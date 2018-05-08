import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { CoverPage, WysiwygEditor, Footer } from 'components';

import { getDbContent } from 'utils';

const Home = ({ site }) => (
  <div className="fa-page">
    <CoverPage site={site} />
    <WysiwygEditor content={getDbContent(site.page.content)} />
    <Footer site={site} />
  </div>
);

function mapStateToProps(state) {
  return { site: state.site };
}

Home.propTypes = { site: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(Home);
