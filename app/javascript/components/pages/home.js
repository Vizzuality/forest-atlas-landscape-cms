import React from "react"
import PropTypes from "prop-types"

import { connect } from 'react-redux';

import { CoverPage, SiteContent, Footer } from '../shared';

const Home = ({ site }) => (
  <div className="fa-page">
    <CoverPage site={site} />
    <SiteContent content={JSON.parse(site.page.content.json)} />
    <Footer site={site} />
  </div>
 );

function mapStateToProps(state) {
  return {
    site: state.site
  }
}

export default connect(mapStateToProps, null)(Home);
