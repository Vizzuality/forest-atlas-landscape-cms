import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { VegaChart } from 'widget-editor';

// /widget_data.json?widget_id=
class WidgetBlock extends React.Component {
  constructor(props) {
    super(props);
    this.widgetConfig = null;
    this.state = {
      loading: true,
      widget: null
    };
  }

  componentWillMount() {
    const { item } = this.props;
    this.getChart(item.content.widgetId);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // This fixes a bug where the widgets would reload when hovering them
    return this.state !== nextState
      || this.props.item.content.widgetId !== nextProps.item.content.widgetId;
  }

  getChart(widgetId) {
    fetch(`${window.location.origin}/widget_data.json?widget_id=${widgetId}`).then((res) => {
      return res.json();
    }).then((w) => {
      const widget = w;
      if (widget.visualization.width !== undefined) delete widget.visualization.width;
      if (widget.visualization.height !== undefined) delete widget.visualization.height;

      this.setState({
        loading: false,
        widget
      });
    });
  }

  render() {
    if (this.state.loading) { return null; }
    return (
      <Fragment>
        <VegaChart
          data={this.state.widget.visualization}
          reloadOnResize
        />
        <div className="metadata">
          <div className="title">{this.state.widget.name}</div>
          {this.state.widget.metadata && !!this.state.widget.metadata.length && this.state.widget.metadata[0].attributes.info && (
            <div className="caption">
              {this.state.widget.metadata[0].attributes.info.caption}
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

WidgetBlock.propTypes = {
  item: PropTypes.object.isRequired
};

export default WidgetBlock;
