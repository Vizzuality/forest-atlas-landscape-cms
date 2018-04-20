import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { CoverPage, WysiwygEditor, Footer } from '../shared';

const Home = ({ site }) => (
  <div className="fa-page">
    <CoverPage site={site} />
    <WysiwygEditor content={JSON.parse(site.page.content.json)} />
    <Footer site={site} />
  </div>
);

function mapStateToProps(state) {
  return { site: state.site };
}

Home.propTypes = { site: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(Home);
