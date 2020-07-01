import React from 'react';
import PropTypes from 'prop-types';
import { VegaChart } from 'widget-editor';

const StandaloneWidget = ({ widget }) => (
  <div className="c-standalone-widget">
    <VegaChart data={widget.widget_config} reloadOnResize />
  </div>
);

StandaloneWidget.propTypes = {
  widget: PropTypes.shape({}).isRequired
};

export default StandaloneWidget;
