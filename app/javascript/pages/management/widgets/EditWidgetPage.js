import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WidgetEditor, { Modal, Tooltip, Icons, setConfig } from 'widget-editor';

import ExtendedHeader from 'components/ExtendedHeader';
import StepsBar from 'components/StepsBar';
import Notification from 'components/Notification';

import { setStep, setWidgetCreationTitle, setWidgetCreationDescription, setWidgetCreationCaption } from 'redactions/management';

const STEPS = [
  {
    name: 'Visualization',
    description: 'Please use the selector to change the type of visualization and choose the columns you want to use.'
  }
];

class EditWidgetPage extends React.Component {
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

    this.state = {
      widgetConfigError: false
    };
  }

  componentWillMount() {
    this.props.setTitle(this.props.widget.name);
    this.props.setDescription(this.props.widget.description);
  }

  /**
   * Event handler executed when the user clicks the "Update"
   * button
   */
  onClickUpdate() {
    // TODO: implement save method
  }

  render() {
    // eslint-disable-next-line no-shadow
    const { currentStep, setStep, setTitle, setDescription, setCaption,
      title, description, caption, widget } = this.props;

    const content = (
      <div>
        <Modal />
        <Tooltip />
        <Icons />
        <div className="l-widget-creation -visualization">
          <div className="wrapper">
            <div className="c-inputs-container">
              <div className="container -big">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="My widget" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="container">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
            </div>
            <WidgetEditor
              datasetId={widget.dataset}
              {...(widget ? { widgetId: widget.id } : {})}
              widgetTitle={title}
              widgetCaption={caption}
              saveButtonMode="never"
              embedButtonMode="never"
              onChangeWidgetTitle={t => setTitle(t)}
              onChangeWidgetCaption={c => setCaption(c)}
              provideWidgetConfig={(func) => { this.getWidgetConfig = func; }}
            />
          </div>
        </div>
      </div>
    );

    const { widgetConfigError } = this.state;

    return (
      <div>
        <ExtendedHeader title={STEPS[currentStep].name} subTitle={STEPS[currentStep].description} />
        <StepsBar
          steps={STEPS.map(s => s.name)}
          currentStep={currentStep}
          onChangeStep={setStep}
        />

        {widgetConfigError && (
          <Notification
            type="warning"
            content="Unable to create the widget"
            additionalContent="Make sure the visualization is correctly previewed before submitting the widget."
            onClose={() => this.setState({ widgetConfigError: false })}
          />
        )}

        {content}

        <div className="c-action-bar">
          <div className="wrapper">
            <button type="button" className="c-button -outline -dark-text" onClick={() => window.history.back()}>
              Cancel
            </button>
            <button type="submit" className="c-button" onClick={() => this.onClickUpdate()}>
              Update
            </button>
          </div>
        </div>
      </div>
    );
  }
}

EditWidgetPage.propTypes = {
  /**
   * Widget to edit
   */
  widget: PropTypes.object,
  env: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  setStep: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  setDescription: PropTypes.func.isRequired,
  setCaption: PropTypes.func.isRequired
};

EditWidgetPage.defaultProps = {
  widget: null
};

function mapStateToProps(state) {
  return {
    env: state.env,
    currentStep: state.management.step,
    title: state.management.widgetCreation.title,
    description: state.management.widgetCreation.description,
    caption: state.management.widgetCreation.caption
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setStep: (...params) => dispatch(setStep(...params)),
    setTitle: (...params) => dispatch(setWidgetCreationTitle(...params)),
    setDescription: (...params) => dispatch(setWidgetCreationDescription(...params)),
    setCaption: (...params) => dispatch(setWidgetCreationCaption(...params))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditWidgetPage);
