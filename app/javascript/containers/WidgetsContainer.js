import React from 'react';
import PropTypes from 'prop-types';
import APISerializer from 'wri-json-api-serializer';


import ManagementContainer from 'containers/shared/ManagementContainer';
import EditWidgetPage from 'pages/management/widgets/EditWidgetPage';
import NewWidgetPage from 'pages/management/widgets/NewWidgetPage';
import WidgetsPage from 'pages/management/widgets/WidgetsPage';

function WidgetsContainer(props) {
  if (props.widget) {
    return (
      <ManagementContainer>
        <EditWidgetPage widget={APISerializer(props.widget)} />
      </ManagementContainer>
    );
  }

  if (props.widgets) {
    return (
      <ManagementContainer>
        <WidgetsPage widgets={props.widgets} />
      </ManagementContainer>
    );
  }

  return (
    <ManagementContainer>
      <NewWidgetPage datasets={APISerializer(props.datasets)} />
    </ManagementContainer>
  );
}

WidgetsContainer.propTypes = {
  widget: PropTypes.any, // eslint-disable-line react/require-default-props
  widgets: PropTypes.array, // eslint-disable-line react/require-default-props
  datasets: PropTypes.array // eslint-disable-line react/require-default-props
};

export default WidgetsContainer;
