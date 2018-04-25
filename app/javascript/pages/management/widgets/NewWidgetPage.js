import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WidgetEditor, { Modal, Tooltip, Icons, setConfig } from 'widget-editor';

import ExtendedHeader from 'components/ExtendedHeader';

class NewWidgetPage extends React.Component {
  constructor(props) {
    super(props);

    // We set the config of the widget editor
    const { env } = props;
    setConfig({
      url: env.apiUrl,
      env: env.apiEnv,
      applications: env.apiApplications,
      authUrl: env.controlTowerUrl,
      assetsPath: '/packs/images/',
      userToken: env.user.token || undefined
    });
  }

  render() {
    return (
      <div>
        <ExtendedHeader title="Widget title" subTitle="Im a subtitle" />
        <Modal />
        <Tooltip />
        <Icons />
        <div className="wrapper">
          <WidgetEditor datasetId="098b33df-6871-4e53-a5ff-b56a7d989f9a" />
        </div>
      </div>
    );
  }
}

NewWidgetPage.propTypes = {
  env: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    env: state.env
  };
}

export default connect(mapStateToProps, null)(NewWidgetPage);
