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
    const {
      setPageSlug,
      setDefaultLanguage,
      setDatasetId,
      setWidgetId,
      fetchFields,
      fetchData,
      fetchWidget,
      fetchDataset,
      fetchChartData,
      pageSlug,
      defaultLanguage,
      dataset,
      widget,
      hiddenFields,
    } = this.props;

    setPageSlug(pageSlug);
    setDefaultLanguage(defaultLanguage);
    setDatasetId(dataset);
    setWidgetId(widget);
    fetchFields(hiddenFields).then(() => fetchData());
    Promise.all([fetchWidget(), fetchDataset()]).then(() => fetchChartData());
  }

  componentDidMount() {
    const { setSelectedLanguage } = this.props;

    if (window.Transifex) {
      // We set the selected language anyway because the user might not change the current
      // language of the page
      setSelectedLanguage(Transifex.live.getSelectedLanguageCode());

      Transifex.live.onTranslatePage(selectedLanguage => setSelectedLanguage(selectedLanguage));
    }
  }

  render() {
    const { downloadUrls, datasetMetadata } = this.props;
    const metadata = datasetMetadata ? datasetMetadata.attributes : {};

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
          {!!metadata && (
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
              {!!metadata.applicationProperties && !!metadata.applicationProperties.download_data && (
                <a
                  className="download"
                  aria-label="Download original dataset"
                  href={metadata.applicationProperties.download_data}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Original dataset <Icon name="icon-download" />
                </a>
              )}
            </div>
          )}
        </div>
        {!!metadata && (
          <Modal
            show={this.props.detailsVisible}
            onClose={() => this.props.setDetailsVisibility(false)}
          >
            <div className="details-modal">
              <h1>{metadata.name}</h1>
              <p>{metadata.description || 'No description'}</p>

              {!!metadata.citation && (
                <div>
                  <h2>Citation</h2>
                  <p>{metadata.citation}</p>
                </div>
              )}

              {!!metadata.applicationProperties && !!metadata.applicationProperties.cautions && (
                <div>
                  <h2>Cautions</h2>
                  <p>{metadata.applicationProperties.cautions}</p>
                </div>
              )}

              {!!metadata.applicationProperties && !!metadata.applicationProperties.function && (
                <div>
                  <h2>Function</h2>
                  <p>{metadata.applicationProperties.function}</p>
                </div>
              )}

              {!!metadata.source && (
                <div>
                  <h2>Source</h2>
                  <ul>
                    {metadata.source.split(',').map(source => (
                      <li key={source}>
                        {source.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!!metadata.applicationProperties && !!metadata.applicationProperties.resolution && (
                <div>
                  <h2>Resolution</h2>
                  <p>{metadata.applicationProperties.resolution}</p>
                </div>
              )}


              {!!metadata.applicationProperties && !!metadata.applicationProperties.geographic_coverage && (
                <div>
                  <h2>Geographic coverage</h2>
                  <p>{metadata.applicationProperties.geographic_coverage}</p>
                </div>
              )}


              {!!metadata.applicationProperties && !!metadata.applicationProperties.frequency_of_updates && (
                <div>
                  <h2>Frequency of updates</h2>
                  <p>{metadata.applicationProperties.frequency_of_updates}</p>
                </div>
              )}

              {!!metadata.applicationProperties && !!metadata.applicationProperties.date_of_content && (
                <div>
                  <h2>Date of content</h2>
                  <p>{metadata.applicationProperties.date_of_content}</p>
                </div>
              )}

              {!!metadata.applicationProperties && !!metadata.applicationProperties.download_data && (
                <div>
                  <h2>Download link</h2>
                  <p>
                    <a href={metadata.applicationProperties.download_data} target="_blank" rel="noopener noreferrer">
                      {metadata.applicationProperties.download_data}
                    </a>
                  </p>
                </div>
              )}

              {!!metadata.applicationProperties && !!metadata.applicationProperties.amazon_link && (
                <div>
                  <h2>Amazon link</h2>
                  <p>
                    <a href={metadata.applicationProperties.amazon_link} target="_blank" rel="noopener noreferrer">
                      {metadata.applicationProperties.amazon_link}
                    </a>
                  </p>
                </div>
              )}

              {!!metadata.applicationProperties && !!metadata.applicationProperties.map_service && (
                <div>
                  <h2>ArcGIS Map Service or Feature Service Link</h2>
                  <p>
                    <a href={metadata.applicationProperties.map_service} target="_blank" rel="noopener noreferrer">
                      {metadata.applicationProperties.map_service}
                    </a>
                  </p>
                </div>
              )}

              {!!metadata.applicationProperties && !!metadata.applicationProperties.agol_link && (
                <div>
                  <h2>ArcGIS Online ItemID Link</h2>
                  <p>
                    <a href={metadata.applicationProperties.agol_link} target="_blank" rel="noopener noreferrer">
                      {metadata.applicationProperties.agol_link}
                    </a>
                  </p>
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
  setDefaultLanguage: PropTypes.func.isRequired,
  setSelectedLanguage: PropTypes.func.isRequired,
  preview: PropTypes.bool,
  dataset: PropTypes.string,
  widget: PropTypes.string,
  topContent: PropTypes.string,
  bottomContent: PropTypes.string,
  downloadUrls: PropTypes.object.isRequired,
  hiddenFields: PropTypes.arrayOf(PropTypes.string),
  defaultLanguage: PropTypes.string,
};

Dashboard.defaultProps = {
  preview: false,
  dataset: null,
  widget: null,
  topContent: null,
  bottomContent: null,
  hiddenFields: [],
  defaultLanguage: null,
};

export default Dashboard;
