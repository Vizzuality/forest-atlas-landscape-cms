import React from 'react';
import PropTypes from 'prop-types';

// Components
import Wysiwyg from 'components/shared/Wysiwyg';
import Tabs from 'components/shared/Tabs';
import DashboardBookmarks from 'components/shared/DashboardBookmarks';
import DashboardFilters from 'components/shared/DashboardFilters';
import DashboardChartView from 'components/shared/DashboardChartView';
import DashboardMapView from 'components/shared/DashboardMapView';
import DashboardTableView from 'components/shared/DashboardTableView';
import Icon from 'components/icon';
import Modal from 'components/Modal';
import Notification from 'components/Notification';

class Dashboard extends React.PureComponent {
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
    const { downloadUrls } = this.props;
    const metadata = this.props.datasetMetadata && this.props.datasetMetadata.attributes;

    let downloadLink = null;
    if (metadata && metadata.info) {
      downloadLink = metadata.info.data_download_link
        || metadata.info.data_download_original_link
        || null;
    }

    return (
      <div className="c-dashboard vizz-wysiwyg">
        {!this.props.preview && <DashboardBookmarks />}
        {!this.props.preview && (
          <Wysiwyg
            readOnly
            items={this.props.topContent ? JSON.parse(this.props.topContent) : []}
            blocks={['text', 'image', 'html']}
          />
        )}
        <DashboardFilters />
        <Tabs
          selected={this.props.selectedTab}
          tabs={this.props.tabs}
          onChange={this.props.onChangeTab}
        />
        <div className="visualization-container">
          {this.props.selectedTab === 'Chart' && <DashboardChartView />}
          {this.props.selectedTab === 'Map' && <DashboardMapView />}
          {this.props.selectedTab === 'Table' && <DashboardTableView />}
        </div>
        <div className="actions-container">
          <div />
          {this.props.datasetData && (
            <div className="right">
              <button
                type="button"
                className="info"
                aria-label="Widget details"
                onClick={() => this.props.setDetailsVisibility(true)}
              >
                <Icon name="icon-info" />
              </button>
              {downloadUrls.csv && (
                <a
                  className="download"
                  aria-label="Download filtered dataset"
                  href={downloadUrls.csv}
                  download
                >
                  CSV <Icon name="icon-download" />
                </a>
              )}
              {downloadUrls.json && (
                <a
                  className="download"
                  aria-label="Download filtered dataset"
                  href={downloadUrls.json}
                  download
                >
                  JSON <Icon name="icon-download" />
                </a>
              )}
              {downloadLink && (
                <a
                  className="download"
                  aria-label="Download original dataset"
                  href={downloadLink}
                  {...(metadata.info.data_download_original_link ? { target: '_blank', rel: 'noopener noreferrer' } : { download: true })}
                >
                  Original dataset <Icon name="icon-download" />
                </a>
              )}
            </div>
          )}
        </div>
        {this.props.datasetData && (
          <Modal
            show={this.props.detailsVisible}
            onClose={() => this.props.setDetailsVisibility(false)}
          >
            <div className="details-modal">
              <h1>{this.props.datasetData.attributes.name}</h1>
              <p>{(this.props.datasetMetadata && metadata.description) || 'No description'}</p>

              {metadata && metadata.info && metadata.info.technical_title && (
                <div>
                  <h2>Formal name</h2>
                  <p>{metadata.info.technical_title}</p>
                </div>
              )}

              {metadata && metadata.info && metadata.info.cautions && (
                <div>
                  <h2>Cautions</h2>
                  <p>{metadata.info.cautions}</p>
                </div>
              )}

              {metadata && metadata.info && metadata.info.citation && (
                <div>
                  <h2>Suggested citation</h2>
                  <p>{metadata.info.citation}</p>
                </div>
              )}

              {metadata && metadata.info && metadata.info.citation && (
                <div>
                  <h2>Suggested citation</h2>
                  <p>{metadata.info.citation}</p>
                </div>
              )}

              {this.props.datasetData.attributes.type && (
                <div>
                  <h2>Data type</h2>
                  <p>{this.props.datasetData.attributes.type}</p>
                </div>
              )}

              {metadata && metadata.info && metadata.info.sources && (
                <div>
                  <h2>Sources</h2>
                  {metadata.info.sources.map(source => (
                    <p key={source['source-name']}>
                      {source['source-name']}<br />
                      {source['source-description']}
                    </p>
                  ))}
                </div>
              )}

              {metadata && metadata.info && metadata.info.geographic_coverage && (
                <div>
                  <h2>Geographic coverage</h2>
                  <p>{metadata.info.geographic_coverage}</p>
                </div>
              )}

              {metadata && metadata.info && metadata.info.spatial_resolution && (
                <div>
                  <h2>Spatial resolution</h2>
                  <p>{metadata.info.spatial_resolution}</p>
                </div>
              )}

              {metadata && metadata.info && metadata.info.date_of_content && (
                <div>
                  <h2>Date of content</h2>
                  <p>{metadata.info.date_of_content}</p>
                </div>
              )}

              {metadata && metadata.info && metadata.info.frequency_of_updates && (
                <div>
                  <h2>Frequency of updates</h2>
                  <p>{metadata.info.frequency_of_updates}</p>
                </div>
              )}

              {metadata && metadata.info && metadata.info.license && (
                <div>
                  <h2>License</h2>
                  <p>
                    {metadata.info.license_link
                      ? <a href={metadata.info.license_link} target="_blank" rel="noopener noreferrer">{metadata.info.license}</a>
                      : metadata.info.license
                    }
                  </p>
                </div>
              )}

              {metadata && metadata.info && metadata.info.summary_of_license && (
                <div>
                  <h2>Summary of license</h2>
                  <p>{metadata.info.summary_of_license}</p>
                </div>
              )}

              {metadata && metadata.info && metadata.info.link_to_license && (
                <div>
                  <h2>Link to full license</h2>
                  <p>
                    <a href={metadata.info.link_to_license} target="_blank" rel="noopener noreferrer">
                      {metadata.info.link_to_license}
                    </a>
                  </p>
                </div>
              )}

              {metadata && metadata.language && (
                <div>
                  <h2>Published language</h2>
                  <p>{metadata.language}</p>
                </div>
              )}

              {metadata && metadata.info && metadata.info.language && metadata.info.language.toLowerCase() !== 'en' && (
                <div>
                  <h2>Translated title</h2>
                  <p>{metadata.info.translated_title}</p>
                </div>
              )}
            </div>
          </Modal>
        )}
        {!this.props.preview && (
          <Wysiwyg
            readOnly
            items={this.props.bottomContent ? JSON.parse(this.props.bottomContent) : []}
            blocks={['text', 'image', 'html']}
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
  detailsVisible: PropTypes.bool.isRequired,
  datasetData: PropTypes.object, // eslint-disable-line react/require-default-props
  datasetMetadata: PropTypes.object, // eslint-disable-line react/require-default-props
  onChangeTab: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  fetchChartData: PropTypes.func.isRequired,
  fetchFields: PropTypes.func.isRequired,
  fetchDataset: PropTypes.func.isRequired,
  setPageSlug: PropTypes.func.isRequired,
  setDatasetId: PropTypes.func.isRequired,
  setWidgetId: PropTypes.func.isRequired,
  fetchWidget: PropTypes.func.isRequired,
  setDetailsVisibility: PropTypes.func.isRequired,
  preview: PropTypes.bool,
  dataset: PropTypes.string,
  widget: PropTypes.string,
  topContent: PropTypes.string,
  bottomContent: PropTypes.string,
  downloadUrls: PropTypes.object.isRequired
};

Dashboard.defaultProps = {
  preview: false,
  dataset: null,
  widget: null,
  topContent: null,
  bottomContent: null
};

export default Dashboard;
