import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WidgetEditor, { Modal, Tooltip, Icons, setConfig, VegaChart, getVegaTheme, getConfig } from 'widget-editor';

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
      // Error while retrieving the widgetConfig from the widget-editor
      widgetConfigError: false,
      // Whether the user has dismissed the warning when switching to
      // the advanced editor
      advancedEditorWarningAccepted: false,
      // Whether we're using the advanced editor
      advancedEditor: false,
      // State of the advanced editor
      widgetConfig: {},
      // Whether the preview of the avanced editor is loading
      previewLoading: false,
      // Error while saving the widget
      saveError: false
    };
  }

  componentDidUpdate(_, prevState) {
    if (!prevState.advancedEditor && this.state.advancedEditor && this.advancedEditor) {
      this.codeMirror = CodeMirror.fromTextArea(this.advancedEditor, {
        mode: 'javascript',
        autoCloseTags: true,
        lineWrapping: true,
        lineNumbers: true
      });

      this.codeMirror.on('change', () => {
        try {
          const widgetConfig = JSON.parse(this.codeMirror.getValue());
          this.setState({ widgetConfig });
        } catch (e) {
          // If there's an error in the JSON, we reset the widgetConfig
          // so the user sees the preview is empty
          this.setState({ widgetConfig: {} });
        }
      });
    }
  }

  /**
   * Event handler executed when the user clicks the "Create"
   * button on the second step
   */
  onClickCreate() {
    new Promise((resolve, reject) => { // eslint-disable-line no-new
      if (this.state.advancedEditor) {
        resolve(this.state.widgetConfig);
      } else {
        this.getWidgetConfig()
          .then(resolve)
          .catch(reject);
      }
    }).then(async (widgetConfig) => {
      let layerObj;
      if (this.getLayer) {
        try {
          layerObj = await this.getLayer();
        } catch (err) {} // eslint-disable-line no-empty
      }

      const widgetObj = Object.assign(
        {},
        {
          name: this.props.title || null,
          description: this.props.description
        },
        { widgetConfig }
      );

      let metadataObj = null;
      if (this.props.caption) {
        metadataObj = {
          info: {
            caption: this.props.caption
          }
        };
      }

      const widget = Object.assign({}, widgetObj, {
        application: [getConfig().applications],
        published: false,
        default: false,
        dataset: this.props.dataset
      });

      const metadata = !metadataObj
        ? null
        : Object.assign({}, metadataObj, {
          language: getConfig().locale,
          application: getConfig().applications
        });

      const layer = !layerObj
        ? null
        : Object.assign({}, layerObj, {
          application: getConfig().applications.split(',')
        });

      fetch(this.props.queryUrl, {
        method: 'POST',
        body: JSON.stringify(Object.assign(
          {},
          { widget },
          { ...(this.state.advancedEditor ? {} : { metadata }) },
          { ...(this.state.advancedEditor ? {} : { layer }) }
        )),
        credentials: 'include',
        headers: new Headers({
          'content-type': 'application/json'
        })
      }).then((res) => {
        if (res.ok) {
          window.location = this.props.redirectUrl;
        } else {
          throw new Error(res.statusText);
        }
      }).catch(() => {
        this.setState({ saveError: true });
      });
    }).catch(() => {
      // We display a warning in the UI
      this.setState({ widgetConfigError: true });
    });
  }

  /**
   * Event handler executed when the user toggles between
   * the "normal" and avanced editor
   */
  onToggleAdvancedEditor() {
    this.setState({
      advancedEditor: !this.state.advancedEditor,
      advancedEditorWarningAccepted: false
    });
  }

  render() {
    // eslint-disable-next-line no-shadow
    const { currentStep, setStep, datasets, dataset, setDataset,
      setTitle, setDescription, setCaption, title, description, caption, redirectUrl } = this.props;
    const { widgetConfigError, advancedEditor,
      advancedEditorWarningAccepted, widgetConfig, previewLoading, saveError } = this.state;

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
                <footer>
                  <div className="c-checkbox">
                    <input type="checkbox" id="advanced-editor" name="advanced-editor" checked={advancedEditor} onClick={() => this.onToggleAdvancedEditor()} />
                    <label htmlFor="advanced-editor">Use the advanced editor to create the widget manually</label>
                  </div>
                </footer>
              </div>
              { !advancedEditor && (
                <WidgetEditor
                  datasetId={dataset}
                  widgetTitle={title}
                  widgetCaption={caption}
                  saveButtonMode="never"
                  embedButtonMode="never"
                  useLayerEditor
                  onChangeWidgetTitle={t => setTitle(t)}
                  onChangeWidgetCaption={c => setCaption(c)}
                  provideWidgetConfig={(func) => { this.getWidgetConfig = func; }}
                  provideLayer={(func) => { this.getLayer = func; }}
                />
              )}
              { advancedEditor && (
                <div className="advanced-editor">
                  <div>
                    <textarea
                      ref={(el) => { this.advancedEditor = el; }}
                      defaultValue={JSON.stringify(widgetConfig)}
                    />
                  </div>
                  <div className="preview">
                    { previewLoading && <div className="c-loading-spinner -bg" /> }
                    <VegaChart
                      data={widgetConfig}
                      theme={getVegaTheme()}
                      showLegend
                      reloadOnResize
                      toggleLoading={loading => this.setState({ previewLoading: loading })}
                      getForceUpdate={(func) => { this.forceChartUpdate = func; }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

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

        {saveError && (
          <Notification
            type="error"
            content="Unable to create the widget"
            additionalContent="Please try again later."
            onClose={() => this.setState({ saveError: false })}
          />
        )}

        {advancedEditor && !advancedEditorWarningAccepted && (
          <Notification
            type="warning"
            content="Onced you've created the widget with the advanced editor, you won't be able to use the simple interface."
            dialogButtons
            closeable={false}
            onCancel={() => this.setState({ advancedEditor: false })}
            onContinue={() => this.setState({ advancedEditorWarningAccepted: true })}
            onClose={() => this.setState({ advancedEditor: false })}
          />
        )}

        {content}

        <div className="c-action-bar">
          <div className="wrapper">
            <a href={redirectUrl} className="c-button -outline -dark-text">
              Cancel
            </a>
            <div>
              { currentStep >= 1 && (
                <button type="button" className="c-button -outline -dark-text" onClick={() => setStep(currentStep - 1)}>
                  Back
                </button>
              )}
              { currentStep === 0 && (
                <button type="submit" className="c-button" disabled={!dataset} onClick={() => setStep(currentStep + 1)}>
                  Continue
                </button>
              )}
              { currentStep === 1 && (
                <button type="submit" className="c-button" disabled={!title} onClick={() => this.onClickCreate()}>
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
  setCaption: PropTypes.func.isRequired,
  queryUrl: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string.isRequired
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
