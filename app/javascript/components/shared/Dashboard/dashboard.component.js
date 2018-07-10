import React from 'react';
import PropTypes from 'prop-types';

// Components
import Tabs from 'components/shared/Tabs';
import DashboardBookmarks from 'components/shared/DashboardBookmarks';
import DashboardFilters from 'components/shared/DashboardFilters';
import DashboardChartView from 'components/shared/DashboardChartView';
import DashboardTableView from 'components/shared/DashboardTableView';

class Dashboard extends React.Component {
  componentWillMount() {
    this.props.setPageSlug(this.props.pageSlug);
    this.props.fetchFields();
    this.props.fetchData();
    this.props.fetchDataset()
      .then(() => this.props.fetchChartData());
  }

  render() {
    return (
      <div className="c-dashboard">
        {!this.props.preview && <DashboardBookmarks />}
        <DashboardFilters />
        <Tabs
          selected={this.props.selectedTab}
          tabs={this.props.tabs}
          onChange={this.props.onChangeTab}
        />
        <div className="visualization-container">
          { this.props.selectedTab === 'Chart' && <DashboardChartView /> }
          { this.props.selectedTab === 'Table' && <DashboardTableView /> }
          { !this.props.error && !this.props.loading && this.props.selectedTab === 'Map' && (
            <ul>
              {this.props.mapWidgets.map(w => <li key={w.id}>w.name</li>)}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  pageSlug: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.name
  })).isRequired,
  selectedTab: PropTypes.string.isRequired,
  onChangeTab: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  fetchChartData: PropTypes.func.isRequired,
  fetchFields: PropTypes.func.isRequired,
  fetchDataset: PropTypes.func.isRequired,
  setPageSlug: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  mapWidgets: PropTypes.array.isRequired,
  preview: PropTypes.bool
};

Dashboard.defaultProps = {
  preview: false
};

export default Dashboard;
