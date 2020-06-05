import React from 'react';
import PropTypes from 'prop-types';
import Renderer from '@widget-editor/renderer';
import { Promise } from 'es6-promise';
import classnames from 'classnames';

import { getDatasetDownloadUrls } from 'helpers/api';
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
    const widgetUrl = `${new URL(`/widget_page/${widget.id}`, window.origin)}&format=png&width=800&height=600&backgrounds=true&filename=${(widget.name || '').replace(/\s/g, '-')}`;
    const res = {
      png: `${ENV.WEBSHOT_API_URL}/webshot/pdf?url=${widgetUrl}`,
    };

    const allowDownload = !!(widget.metadata
      && widget.metadata.length
      && widget.metadata[0].attributes.info
      && widget.metadata[0].attributes.info.allowDownload);

    const dataUrl = (widget.visualization && widget.visualization.data
      && widget.visualization.data.length
      && widget.visualization.data[0].url)
      || '';

    if (!dataUrl.length || !allowDownload) {
      return res;
    }

    const sqlQuery = new URL(decodeURI(dataUrl)).searchParams.get('sql').trim();

    if (!sqlQuery) {
      return res;
    }

    const simplifiedSqlQuery = sqlQuery
      // We pick all the columns
      .replace(/^SELECT (.*) FROM/i, 'SELECT * FROM')
      // We remove any aggregation
      .replace(/GROUP BY .+?(?=(ORDER BY|LIMIT|$))/i, '')
      // We remove any ordering
      .replace(/ORDER BY .+? ((ASC)|DESC)/i, '')
      // We remove any limit
      .replace(/LIMIT \d+/i, '');

    const datasetProvider = await WidgetBlock.getDatasetProvider(widget.dataset);

    return Object.assign(
      {},
      res,
      getDatasetDownloadUrls(widget.dataset, datasetProvider, simplifiedSqlQuery)
    );
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
      this.state !== nextState
      || this.props.item.content.widgetId !== nextProps.item.content.widgetId
      || this.props.item.content.height !== nextProps.item.content.height
      || this.props.item.content.border !== nextProps.item.content.border
    );
  }

  getChart(widgetId) {
    return fetch(
      `${window.location.origin}/widget_data.json?widget_id=${widgetId}`
    )
      .then(res => res.json())
      .then(
        w => new Promise((resolve) => {
          const widget = w;
          if (
            widget.visualization
              && widget.visualization.width !== undefined
          ) { delete widget.visualization.width; }
          if (
            widget.visualization
              && widget.visualization.height !== undefined
          ) { delete widget.visualization.height; }

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
    const { height, border } = item.content;
    const { loading, widget, downloadUrls } = this.state;

    if (loading) {
      return (
        <div className="c-widget-card">
          <div className="c-loading-spinner" />
        </div>
      );
    }

    if (!loading && (!widget || !widget.visualization)) {
      return (
        <div className="c-widget-card">
          Unable to load the widget.
        </div>
      );
    }

    return (
      <div
        className={classnames({
          'c-widget-card': true,
          // Widgets previously inserted in Open Content pages shouldn't display a border
          // This explains the condition
          '-border': border === true
        })}
      >
        <div className="title">{widget.name}</div>
        <div className="description">{widget.description}</div>
        <div
          className="chart-container"
          // We choose min-height instead of height because custom widget might define a higher
          // height
          // Anyway, we don't want widget shorter than 250px
          style={{ minHeight: `${Math.max(height, 250) || 250}px` }}
        >
          <Renderer
            // The key here is used to make sure the widget is rerendered when its height is changed
            key={height}
            widgetConfig={widget.visualization}
          />
        </div>
        <div className="widget-footer">
          <div className="citation">
            {widget.metadata && !!widget.metadata.length && widget.metadata[0].attributes.info
              && widget.metadata[0].attributes.info.citation}
          </div>
          <div className="download">
            {downloadUrls.csv && (
              <a
                aria-label="Download widget data in CSV format"
                href={downloadUrls.csv}
                download
              >
                CSV <Icon name="icon-download" />
              </a>
            )}
            {downloadUrls.png && (
              <a
                aria-label="Download widget as a PNG image"
                href={downloadUrls.png}
                download
              >
                PNG <Icon name="icon-download" />
              </a>
            )}
          </div>
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
                  onChange={e => onChange({
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
              <label>
                <input
                  type="checkbox"
                  // Widgets previously inserted in Open Content pages shouldn't display a border
                  // This explains the condition
                  defaultChecked={border === true}
                  onChange={e => onChange({
                    content: {
                      ...item.content,
                      border: e.target.checked
                    }
                  })
                  }
                />
                Display a border around the widget
              </label>
            </main>
          </div>
        )}
      </div>
    );
  }
}

WidgetBlock.propTypes = {
  item: PropTypes.object.isRequired
};

export default WidgetBlock;
