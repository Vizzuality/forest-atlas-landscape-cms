import React from 'react';
import PropTypes from 'prop-types';

import PublicContainer from 'containers/shared/PublicContainer';
import StandaloneWidget from 'components/public/StandaloneWidget';

class WidgetPageContainer extends PublicContainer {
  render() {
    const { widget } = this.props;

    if (!widget || !widget.widget_config) {
      return null;
    }

    return <StandaloneWidget widget={widget} />;
  }
}

WidgetPageContainer.propTypes = {
  widget: PropTypes.shape({}).isRequired
};

export default WidgetPageContainer;
