
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CoverPage from '../components/CoverPage';
import * as SiteActions from '../actions/site';

function mapStateToProps(state) {
  return {
    site: state.site
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SiteActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CoverPage);
