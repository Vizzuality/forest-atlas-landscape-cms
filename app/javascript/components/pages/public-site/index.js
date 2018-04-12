
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as SiteActions from './public-site-actions';
import PublicSiteComponent from './public-site-component';

function mapStateToProps(state) {
  return {
    site: state.site
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SiteActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PublicSiteComponent);
