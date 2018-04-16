import React from "react"
import PropTypes from "prop-types"

import { CoverPage, SiteContent, Footer } from '../../shared';

class PublicSite extends React.Component {
  render () {
    const { site } = this.props;
    return (<div className="fa-page">
      <CoverPage site={site} />
      <SiteContent content={JSON.parse(site.page.content.json)} />
      <Footer site={site} />
    </div>)
  }
}

PublicSite.propTypes = {

};

export default PublicSite
