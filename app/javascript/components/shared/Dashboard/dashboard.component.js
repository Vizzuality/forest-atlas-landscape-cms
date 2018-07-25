import React from 'react';
import PropTypes from 'prop-types';
import Wysiwyg from 'vizz-wysiwyg';

// Components
import Tabs from 'components/shared/Tabs';
import DashboardBookmarks from 'components/shared/DashboardBookmarks';
import DashboardFilters from 'components/shared/DashboardFilters';
import DashboardChartView from 'components/shared/DashboardChartView';
import DashboardTableView from 'components/shared/DashboardTableView';
import { ImageUpload, ImagePreview, HtmlEmbedPreview } from 'components/wysiwyg';

class Dashboard extends React.Component {
  componentWillMount() {
    this.props.setPageSlug(this.props.pageSlug);
    this.props.setDatasetId(this.props.dataset);
    this.props.setWidgetId(this.props.widget);
    this.props.fetchFields()
      .then(() => this.props.fetchData());
    Promise.all([this.props.fetchWidget(), this.props.fetchDataset()])
      .then(() => this.props.fetchChartData());
  }

  render() {
    return (
      <div className="c-dashboard vizz-wysiwyg">
        {!this.props.preview && <DashboardBookmarks />}
        {!this.props.preview && (
          <Wysiwyg
            readOnly
            items={this.props.topContent ? JSON.parse(this.props.topContent) : []}
            blocks={{
              image: {
                Component: ImagePreview,
                EditionComponent: ImageUpload,
                icon: 'icon-image',
                label: 'Image',
                renderer: 'tooltip'
              },
              html: {
                Component: HtmlEmbedPreview,
                icon: 'icon-embed',
                label: 'Custom HTML',
                renderer: 'tooltip'
              }
            }}
          />
        )}
        <DashboardFilters />
        <Tabs
          selected={this.props.selectedTab}
          tabs={this.props.tabs}
          onChange={this.props.onChangeTab}
        />
        <div className="visualization-container">
          { this.props.selectedTab === 'Chart' && <DashboardChartView /> }
          { this.props.selectedTab === 'Table' && <DashboardTableView /> }
        </div>
        {!this.props.preview && (
          <Wysiwyg
            readOnly
            items={this.props.bottomContent ? JSON.parse(this.props.bottomContent) : []}
            blocks={{
              image: {
                Component: ImagePreview,
                EditionComponent: ImageUpload,
                icon: 'icon-image',
                label: 'Image',
                renderer: 'tooltip'
              },
              html: {
                Component: HtmlEmbedPreview,
                icon: 'icon-embed',
                label: 'Custom HTML',
                renderer: 'tooltip'
              }
            }}
          />
        )}
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
  setDatasetId: PropTypes.func.isRequired,
  setWidgetId: PropTypes.func.isRequired,
  fetchWidget: PropTypes.func.isRequired,
  preview: PropTypes.bool,
  dataset: PropTypes.string,
  widget: PropTypes.string,
  topContent: PropTypes.string,
  bottomContent: PropTypes.string
};

Dashboard.defaultProps = {
  preview: false,
  dataset: null,
  widget: null,
  topContent: null,
  bottomContent: null
};

export default Dashboard;
