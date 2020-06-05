import React from 'react';
import PropTypes from 'prop-types';
import Renderer from '@widget-editor/renderer';

const DashboardChartView = ({ error, loading, chartLoading, widget }) => (
  <div className="c-dashboard-chart-view">
    {!error && (loading || chartLoading) && <div className="c-loading-spinner -bg" />}
    {error && !loading && (!widget || widget.widgetConfig) && (
      <p className="error">The data failed to load.</p>
    )}
    {error && !loading && widget && !widget.widgetConfig && (
      <p className="error">{'This widget can\'t be displayed.'}</p>
    )}
    {!error && !loading && widget && widget.widgetConfig && (
      <Renderer widgetConfig={widget.widgetConfig} />
    )}
  </div>
);

DashboardChartView.propTypes = {
  widget: PropTypes.object,
  chartLoading: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
};

DashboardChartView.defaultProps = {
  widget: null
};

export default DashboardChartView;
