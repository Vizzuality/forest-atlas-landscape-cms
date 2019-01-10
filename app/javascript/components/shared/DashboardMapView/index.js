import { connect } from 'react-redux';

import DashboardMapView from 'components/shared/DashboardMapView/dashboard-map-view.component';
import { getLayerUrl, getSqlWhereSelector, getFieldsDisplayNames } from 'components/shared/DashboardMapView/dashboard-map-view.selectors';

const mapStateToProps = state => ({
  layerUrl: getLayerUrl(state),
  sqlWhere: getSqlWhereSelector(state),
  fieldsDisplayNames: getFieldsDisplayNames(state)
});

export default connect(mapStateToProps, null)(DashboardMapView);
