import React from 'react';
import PropTypes from 'prop-types';

import ManagementContainer from 'containers/shared/ManagementContainer';
import EditWidgetPage from 'pages/management/widgets/EditWidgetPage';
import NewWidgetPage from 'pages/management/widgets/NewWidgetPage';
import WidgetsPage from 'pages/management/widgets/WidgetsPage';

function WidgetsContainer({ widgets, widget, datasets, queryUrl, redirectUrl, defaultLanguage }) {
  if (widget) {
    return (
      <ManagementContainer>
        <EditWidgetPage
          widget={widget}
          queryUrl={queryUrl}
          redirectUrl={redirectUrl}
          defaultLanguage={defaultLanguage}
        />
      </ManagementContainer>
    );
  }

  if (widgets) {
    return (
      <ManagementContainer>
        <WidgetsPage widgets={widgets} />
      </ManagementContainer>
    );
  }

  return (
    <ManagementContainer>
      <NewWidgetPage
        datasets={datasets}
        queryUrl={queryUrl}
        redirectUrl={redirectUrl}
        defaultLanguage={defaultLanguage}
      />
    </ManagementContainer>
  );
}

WidgetsContainer.propTypes = {
  widget: PropTypes.any,
  widgets: PropTypes.array,
  datasets: PropTypes.array,
  queryUrl: PropTypes.string,
  redirectUrl: PropTypes.string,
  defaultLanguage: PropTypes.string,
};

WidgetsContainer.defaultProps = {
  defaultLanguage: 'en', // We should never pass null as a locale
};

export default WidgetsContainer;
