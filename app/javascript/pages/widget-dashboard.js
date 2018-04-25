import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { Table, Widget } from 'components';

const WidgetDashboard = ({ dashboard }) => (
  <div className="fa-page">
    {/* Figure out how we fetch this id ? */}
    <Widget id={1} />
    <Table data={dashboard.dashboard.data} searchable={false} />
  </div>
);

function mapStateToProps(state) {
  return { dashboard: state.dashboard };
}

WidgetDashboard.propTypes = { dashboard: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(WidgetDashboard);
