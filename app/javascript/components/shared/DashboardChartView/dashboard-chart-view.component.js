import React from 'react';
import PropTypes from 'prop-types';
import { VegaChart } from 'widget-editor';

class DashboardChartView extends React.Component {
  render() {
    return (
      <div className="c-dashboard-chart-view">
        { !this.props.error && (this.props.loading || this.props.chartLoading) &&
          <div className="c-loading-spinner -bg" />
        }
        { this.props.error && !this.props.loading
          && (!this.props.widget || this.props.widget.widgetConfig) && (
          <p className="error">The data failed to load.</p>
        )}
        { this.props.error && !this.props.loading && this.props.widget
          && !this.props.widget.widgetConfig && (
          <p className="error">{'This widget can\'t be displayed.'}</p>
        ) }
        { !this.props.error && !this.props.loading && this.props.widget
          && this.props.widget.widgetConfig && (
          <VegaChart
            data={this.props.widget.widgetConfig}
            toggleLoading={this.props.setChartLoading}
            reloadOnResize
          />
        )}
      </div>
    );
  }
}

DashboardChartView.propTypes = {
  widget: PropTypes.object,
  chartLoading: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  setChartLoading: PropTypes.func.isRequired
};

DashboardChartView.defaultProps = {
  widget: null
};

export default DashboardChartView;
