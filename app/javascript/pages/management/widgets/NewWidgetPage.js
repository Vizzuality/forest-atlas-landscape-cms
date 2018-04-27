import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WidgetEditor, { Modal, Tooltip, Icons, setConfig } from 'widget-editor';

import ExtendedHeader from 'components/ExtendedHeader';
import StepsBar from 'components/StepsBar';
import Notification from 'components/Notification';

import { setStep, setWidgetCreationDataset, setWidgetCreationTitle, setWidgetCreationDescription, setWidgetCreationCaption } from 'redactions/management';

const STEPS = [
  {
    name: 'Dataset',
    description: 'Pick the dataset you want to use for the widget.'
  },
  {
    name: 'Visualization',
    description: 'Please use the selector to change the type of visualization and choose the columns you want to use.'
  }
];

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

    this.state = {
      widgetConfigError: false
    };
  }

  /**
   * Event handler executed when the user clicks the "Create"
   * button on the second step
   */
  onClickCreate() {
    if (!this.getWidgetConfig) {
      // TODO: error case
    }

    this.getWidgetConfig()
      .then((widgetConfig) => {
        // TODO: send data to backend
        console.log(widgetConfig);
      })
      .catch(() => {
        // We display a warning in the UI
        this.setState({ widgetConfigError: true });
      });
  }

  render() {
    // eslint-disable-next-line no-shadow
    const { currentStep, setStep, datasets, dataset, setDataset,
      setTitle, setDescription, setCaption, title, description, caption } = this.props;

    let content;
    if (currentStep === 0) {
      content = (
        <div className="l-widget-creation -dataset">
          <div className="wrapper">
            <div className="c-inputs-container">
              <div className="container -big">
                <label htmlFor="dataset">Dataset</label>
                <select id="dataset" name="dataset" defaultValue={dataset || ''} onChange={e => setDataset(e.target.selectedOptions[0].value)}>
                  <option value="">Select a dataset</option>
                  {datasets.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      content = (
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
                datasetId={dataset}
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
    }

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
            <div>
              { currentStep >= 1 && (
                // <%= link_to 'Cancel', management_site_widgets_path, class: 'c-button -outline -dark-text js-cancel' %>
                <button type="button" className="c-button -outline -dark-text" onClick={() => setStep(currentStep - 1)}>
                  Back
                </button>
              )}
              { currentStep === 0 && dataset && (
                <button type="submit" className="c-button" onClick={() => setStep(currentStep + 1)}>
                  Continue
                </button>
              )}
              { currentStep === 1 && (
                <button type="submit" className="c-button" onClick={() => this.onClickCreate()}>
                  Create
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewWidgetPage.propTypes = {
  env: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
  datasets: PropTypes.array.isRequired,
  dataset: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  setStep: PropTypes.func.isRequired,
  setDataset: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  setDescription: PropTypes.func.isRequired,
  setCaption: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    env: state.env,
    currentStep: state.management.step,
    dataset: state.management.widgetCreation.dataset,
    title: state.management.widgetCreation.title,
    description: state.management.widgetCreation.description,
    caption: state.management.widgetCreation.caption
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setStep: (...params) => dispatch(setStep(...params)),
    setDataset: (...params) => dispatch(setWidgetCreationDataset(...params)),
    setTitle: (...params) => dispatch(setWidgetCreationTitle(...params)),
    setDescription: (...params) => dispatch(setWidgetCreationDescription(...params)),
    setCaption: (...params) => dispatch(setWidgetCreationCaption(...params))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewWidgetPage);
