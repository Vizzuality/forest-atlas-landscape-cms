import React from "react"
import PropTypes from "prop-types"

import { CoverPage } from '../../shared';

class PublicSite extends React.Component {
  render () {
    return (<div className="fa-page">
      <CoverPage site={this.props.site} />
    </div>)
  }
}

PublicSite.propTypes = {

};

export default PublicSite
