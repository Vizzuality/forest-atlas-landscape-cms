import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { VegaChart } from 'widget-editor';
import { Promise } from 'es6-promise';

import {
  isVegaWidget,
  getVegaWidgetQueryParams,
  getDatasetDownloadUrls,
  getSqlFilters
} from 'helpers/api';
import Icon from 'components/icon';

// /widget_data.json?widget_id=
class WidgetBlock extends React.Component {
  /**
   * Return the provider of the dataset
   * @param {string} datasetId
   */
  static async getDatasetProvider(datasetId) {
    const query = `${ENV.API_URL}/dataset/${datasetId}`;
    const data = await fetch(query).then(res => res.json());
    const {
      data: {
        attributes: { provider }
      }
    } = data;
    return provider;
  }

  /**
   * Return the URLs to download the data of the widget (in several formats)
   * @param {object} widget
   */
  static async getDownloadUrls(widget) {
    const isValidWidget = isVegaWidget({ widgetConfig: widget.visualization });
    if (!isValidWidget) {
      return {};
    }

    const datasetProvider = await WidgetBlock.getDatasetProvider(
      widget.dataset
    );
    const { filters, limit } = getVegaWidgetQueryParams({
      widgetConfig: widget.visualization
    });

    const serializedFilters = getSqlFilters(filters, datasetProvider);

    const sqlQuery = `SELECT * FROM data ${
      serializedFilters.length ? `WHERE ${serializedFilters}` : ''
    }`;

    return getDatasetDownloadUrls(widget.dataset, datasetProvider, sqlQuery);
  }

  constructor(props) {
    super(props);
    this.widgetConfig = null;
    this.state = {
      loading: true,
      widget: null,
      downloadUrls: {}
    };
  }

  componentWillMount() {
    const { item } = this.props;
    this.getChart(item.content.widgetId).then(async () => {
      this.setState({
        downloadUrls: await WidgetBlock.getDownloadUrls(this.state.widget)
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // This fixes a bug where the widgets would reload when hovering them
    return (
      this.state !== nextState ||
      this.props.item.content.widgetId !== nextProps.item.content.widgetId ||
      this.props.item.content.height !== nextProps.item.content.height
    );
  }

  getChart(widgetId) {
    return fetch(
      `${window.location.origin}/widget_data.json?widget_id=${widgetId}`
    )
      .then(res => {
        return res.json();
      })
      .then(
        w =>
          new Promise(resolve => {
            const widget = w;
            if (
              widget.visualization &&
              widget.visualization.width !== undefined
            )
              delete widget.visualization.width;
            if (
              widget.visualization &&
              widget.visualization.height !== undefined
            )
              delete widget.visualization.height;

            this.setState(
              {
                loading: false,
                widget
              },
              resolve
            );
          })
      );
  }

  render() {
    const { readOnly, item, onChange } = this.props;
    const { height } = item.content;
    const { loading, widget, downloadUrls } = this.state;

    if (loading || !widget.visualization) {
      return null;
    }

    return (
      <Fragment>
        <div className="c-we-chart-title">{widget.name}</div>
        <div
          className="c-we-chart-container"
          // We choose min-height instead of height because custom widget might define a higher
          // height
          // Anyway, we don't want widget shorter than 250px
          style={{ 'min-height': `${Math.max(height, 250) || 250}px` }}
        >
          <VegaChart
            // The key here is used to make sure the widget is rerendered when its height is changed
            key={height}
            data={widget.visualization}
            reloadOnResize
          />
        </div>
        {widget.metadata &&
          !!widget.metadata.length &&
          widget.metadata[0].attributes.info && (
            <div className="c-we-chart-caption">
              {widget.metadata[0].attributes.info.caption}
            </div>
          )}
        <div className="c-we-chart-download">
          {downloadUrls.csv && (
            <a
              className="download"
              aria-label="Download widget data in CSV format"
              href={downloadUrls.csv}
              download
            >
              CSV <Icon name="icon-download" />
            </a>
          )}
        </div>
        {!readOnly && (
          <div className="fa-wysiwyg-configuration">
            <header>
              <span>Configuration</span>
            </header>
            <main>
              <label>
                Height (250px minimum)
                <input
                  type="number"
                  className="fa-wysiwyg-file__preview--captionInput"
                  placeholder="Height in pixels"
                  defaultValue={height || 250}
                  min={250}
                  onChange={e =>
                    onChange({
                      content: {
                        ...item.content,
                        height: Number.isInteger(+e.target.value)
                          ? Math.max(+e.target.value, 250) // Minimum height should stay 250px
                          : height
                      }
                    })
                  }
                />
              </label>
              <small>
                Please note that if a custom widget has its height defined in
                the Vega specification, it won't be overwritten.
              </small>
            </main>
          </div>
        )}
      </Fragment>
    );
  }
}

WidgetBlock.propTypes = {
  item: PropTypes.object.isRequired
};

export default WidgetBlock;
