import React from "react"
import PropTypes from "prop-types"

import { CoverPage, SiteContent, Footer } from '../../shared';

const StaticPage = ({ site }) => (
  <div className="fa-page">
    <CoverPage site={site} secondary />
    <SiteContent content={JSON.parse(site.page.content.json)} />
    <Footer site={site} />
  </div>
 );

export default StaticPage;
