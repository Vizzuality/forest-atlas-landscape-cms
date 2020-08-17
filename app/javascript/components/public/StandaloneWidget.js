import React from 'react';
import PropTypes from 'prop-types';
import Renderer from '@widget-editor/renderer';

const StandaloneWidget = ({ widget }) => (
  <div className="c-standalone-widget">
    <Renderer widgetConfig={widget.widget_config} />
  </div>
);

StandaloneWidget.propTypes = {
  widget: PropTypes.shape({}).isRequired
};

export default StandaloneWidget;
