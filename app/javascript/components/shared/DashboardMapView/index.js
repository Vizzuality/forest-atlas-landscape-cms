import { connect } from 'react-redux';

import DashboardMapView from 'components/shared/DashboardMapView/dashboard-map-view.component';
import { getLayerUrl, getSqlWhereSelector } from 'components/shared/DashboardMapView/dashboard-map-view.selectors';

const mapStateToProps = state => ({
  layerUrl: getLayerUrl(state),
  sqlWhere: getSqlWhereSelector(state)
});

export default connect(mapStateToProps, null)(DashboardMapView);
