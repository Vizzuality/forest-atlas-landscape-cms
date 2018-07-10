import React from 'react';
import PropTypes from 'prop-types';

// Components
import { Table } from 'components';

class DashboardTableView extends React.Component {
  render() {
    return (
      <div className="c-dashboard-table-view">
        { !this.props.error && this.props.loading &&
          <div className="c-loading-spinner -bg" />
        }
        { this.props.error && !this.props.loading && (
          <p className="error">The data failed to load.</p>
        )}
        { !this.props.error && !this.props.loading && <div className="note">Only the first 500 results are displayed</div>}
        { !this.props.error && !this.props.loading && (
          <Table
            name="Data of the dataset"
            limit={25}
            columns={this.props.columns}
            data={this.props.data}
          />
        )}
      </div>
    );
  }
}

DashboardTableView.propTypes = {
  error: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired
};

export default DashboardTableView;
