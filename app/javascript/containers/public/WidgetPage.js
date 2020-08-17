import React from 'react';
import PropTypes from 'prop-types';

import PublicContainer from 'containers/shared/PublicContainer';
import StandaloneWidget from 'components/public/StandaloneWidget';

const WidgetPageContainer = ({ widget }) => {
  if (!widget || !widget.widget_config) {
    return null;
  }

  return (
    <PublicContainer>
      <StandaloneWidget widget={widget} />
    </PublicContainer>
  );
};

WidgetPageContainer.propTypes = {
  widget: PropTypes.shape({}).isRequired
};

export default WidgetPageContainer;
