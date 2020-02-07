import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WidgetEditor, {
  Modal,
  Tooltip,
  Icons,
  setConfig,
  VegaChart,
  getConfig,
  getVegaTheme
} from 'widget-editor';

import ExtendedHeader from 'components/ExtendedHeader';
import StepsBar from 'components/StepsBar';
import Notification from 'components/Notification';
import ThemeSelector from 'components/ThemeSelector';
import ToggleSwitcher from 'components/shared/ToggleSwitcher';

import {
  setStep,
  setWidgetCreationDataset,
  setWidgetCreationTitle,
  setWidgetCreationDescription,
  setWidgetCreationPrivateName,
  setWidgetCreationCitation,
  setWidgetCreationAllowDownload
} from 'redactions/management';

import { getMostAppropriateMetadataLanguage } from './helpers';

const STEPS = [
  {
    name: 'Dataset',
    description: 'Pick the dataset you want to use for the widget.'
  },
  {
    name: 'Details',
    description: 'Set up the basic information about your widget.'
  },
  {
    name: 'Visualization',
    description:
      'Please use the selector to change the type of visualization and choose the columns you want to use.'
  }
];

class NewWidgetPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Whether we're initialising data for the widget-editor
      initializingEditor: true,
      // Whether we're currently creating the widget in the API
      creating: false,
      // Error while retrieving the widgetConfig from the widget-editor
      widgetConfigError: false,
      // Whether the user has dismissed the warning when switching to
      // the advanced editor
      advancedEditorWarningAccepted: false,
      // Whether we're using the advanced editor
      advancedEditor: false,
      // Whether we're loading the advanced editor
      advancedEditorLoading: false,
      // State of the advanced editor
      widgetConfig: {},
      // Whether the preview of the avanced editor is loading
      previewLoading: false,
      // Error while saving the widget
      saveError: false,
      // Theme of the widget
      theme: undefined
    };

    this.onCustomizeTheme = this.onCustomizeTheme.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { env, defaultLanguage, dataset, currentStep } = this.props;
    const { advancedEditor } = this.state;

    if (!prevState.advancedEditor && advancedEditor && this.advancedEditor) {
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

    if (prevProps.currentStep !== currentStep && currentStep === 1) {
      let locale = null;

      new Promise(resolve => {
        this.setState({ initializingEditor: true }, resolve);
      })
        .then(() =>
          getMostAppropriateMetadataLanguage(dataset, defaultLanguage)
        )
        .then(language => {
          locale = language;
        })
        .catch(() => null)
        .then(() => {
          // We configure the widget-editor
          // The important bit here is giving it the locale which has alias info
          setConfig({
            url: env.apiUrl,
            env: env.apiEnv,
            applications: env.apiApplications,
            authUrl: env.controlTowerUrl,
            assetsPath: '/packs/images/',
            userToken: env.user.token || undefined,
            locale
          });

          // We render the widget-editor
          this.setState({ initializingEditor: false });
        });
    }
  }

  /**
   * Event handler executed when the user clicks the "Create"
   * button on the second step
   */
  onClickCreate() {
    this.setState({ creating: true });

    new Promise((resolve, reject) => {
      // eslint-disable-line no-new
      if (this.state.advancedEditor) {
        // If the user hasn't defined any theme in the wysiwyg and if one
        // has been selected in the theme selector, then we had it before
        // creating the widget
        if (
          this.state.widgetConfig &&
          !this.state.widgetConfig.config &&
          this.state.theme
        ) {
          resolve(
            Object.assign({}, this.state.widgetConfig, {
              config: this.state.theme
            })
          );
        }

        resolve(this.state.widgetConfig);
      } else {
        this.getWidgetConfig()
          .then(resolve)
          .catch(reject);
      }
    })
      .then(async widgetConfig => {
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

        const metadataObj = {
          info: {
            privateName: this.props.privateName,
            citation: this.props.citation,
            allowDownload: this.props.allowDownload,
          }
        };

        const widget = Object.assign({}, widgetObj, {
          application: [getConfig().applications],
          published: false,
          default: false,
          dataset: this.props.dataset
        });

        const metadata = Object.assign({}, metadataObj, {
          language: 'en', // Widgets metadata doesn't change depending of language
          application: getConfig().applications
        });

        const layer = !layerObj
          ? null
          : Object.assign({}, layerObj, {
              application: getConfig().applications.split(',')
            });

        fetch(this.props.queryUrl, {
          method: 'POST',
          body: JSON.stringify(
            Object.assign(
              {},
              { widget },
              { metadata },
              { ...(this.state.advancedEditor ? {} : { layer }) }
            )
          ),
          credentials: 'include',
          headers: new Headers({
            'content-type': 'application/json'
          })
        })
          .then(res => {
            if (res.ok) {
              window.location = this.props.redirectUrl;
            } else {
              throw new Error(res.statusText);
            }
          })
          .catch(() => {
            this.setState({ saveError: true, creating: false });
          });
      })
      .catch(() => {
        // We display a warning in the UI
        this.setState({ widgetConfigError: true, creating: false });
      });
  }

  /**
   * Event handler executed when the user toggles between
   * the "normal" and avanced editor
   */
  onToggleAdvancedEditor() {
    const toggleAdvancedEditor = () => {
      this.setState({
        advancedEditor: !this.state.advancedEditor,
        advancedEditorWarningAccepted: false
      });
    };

    if (this.state.advancedEditor) {
      return toggleAdvancedEditor();
    }

    return new Promise(resolve =>
      this.setState({ advancedEditorLoading: true }, resolve)
    )
      .then(() => this.getWidgetConfig())
      .then(res => {
        const widgetConfig = Object.assign({}, res);
        delete widgetConfig.paramsConfig;
        delete widgetConfig.config;
        return new Promise(resolve =>
          this.setState(
            {
              widgetConfig,
              advancedEditorLoading: false
            },
            resolve
          )
        );
      })
      .catch(
        () =>
          new Promise(resolve =>
            this.setState(
              {
                widgetConfig: {},
                advancedEditorLoading: false
              },
              resolve
            )
          )
      )
      .then(() => toggleAdvancedEditor());
  }

  /**
   * Event handler executed when the user changes the theme
   * of the widget
   * @param {object} themeConfiguration Theme configuration
   */
  onChangeTheme(themeConfiguration) {
    const defaultTheme = getVegaTheme();
    const theme = Object.assign({}, defaultTheme, {
      name: themeConfiguration.name,
      range: Object.assign({}, defaultTheme.range, {
        category20: themeConfiguration.category
      }),
      mark: Object.assign({}, defaultTheme.mark, {
        fill: themeConfiguration.mainColor
      }),
      symbol: Object.assign({}, defaultTheme.symbol, {
        fill: themeConfiguration.mainColor
      }),
      rect: Object.assign({}, defaultTheme.rect, {
        fill: themeConfiguration.mainColor
      }),
      line: Object.assign({}, defaultTheme.line, {
        stroke: themeConfiguration.mainColor
      })
    });

    this.setState({ theme });
  }

  /**
   * Event handler executed when the user modifies a
   * theme
   * @param {object} theme Customized theme
   */
  onCustomizeTheme(theme) {
    this.setState({ theme });
  }

  render() {
    // eslint-disable-next-line no-shadow
    const {
      currentStep,
      setStep,
      datasets,
      dataset,
      setDataset,
      setTitle,
      setPrivateName,
      setDescription,
      setCitation,
      setAllowDownload,
      title,
      privateName,
      description,
      citation,
      allowDownload,
      redirectUrl
    } = this.props;

    const {
      initializingEditor,
      widgetConfigError,
      advancedEditor,
      advancedEditorLoading,
      advancedEditorWarningAccepted,
      widgetConfig,
      previewLoading,
      saveError,
      creating
    } = this.state;

    let content;
    if (currentStep === 0) {
      content = (
        <div className="l-widget-creation -dataset">
          <div className="wrapper">
            <div className="c-inputs-container">
              <div className="container -big">
                <label htmlFor="dataset">Dataset</label>
                <select
                  id="dataset"
                  name="dataset"
                  defaultValue={dataset || ''}
                  onChange={e => setDataset(e.target.selectedOptions[0].value)}
                >
                  <option value="">Select a dataset</option>
                  {datasets.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (currentStep === 1) {
      content = (
        <div>
          <div className="l-widget-creation -visualization">
            <div className="wrapper">
              <div className="c-inputs-container">
                <div className="container -big">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="My widget"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>
                <div className="container">
                  <label htmlFor="private-name">
                    Private name{' '}
                    <button
                      type="button"
                      className="info-button"
                      data-tippy="The private name is only displayed within the management section of the site."
                      data-tippy-interactive="true"
                    >
                      Field information
                    </button>
                  </label>
                  <input
                    type="text"
                    id="private-name"
                    name="private-name"
                    placeholder="Private name"
                    value={privateName}
                    onChange={e => setPrivateName(e.target.value)}
                  />
                </div>
                <div className="container">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
                <div className="container">
                  <label htmlFor="citation">Citation</label>
                  <textarea
                    id="citation"
                    name="citation"
                    placeholder="Citation"
                    value={citation}
                    onChange={e => setCitation(e.target.value)}
                  />
                </div>
                <div className="container">
                  <div className="c-checkbox">
                    <input
                      type="checkbox"
                      id="allow-download"
                      name="allow-download"
                      checked={allowDownload}
                      onChange={e => setAllowDownload(e.target.checked)}
                    />
                    <label htmlFor="allow-download">
                      Allow the user to download the data of the widget in the
                      Open Content pages
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (initializingEditor) {
      content = (
        <div className="l-widget-creation -visualization">
          <div className="wrapper">
            <div className="c-loading-spinner -bg" />
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
                <div className="container">
                  <label>Widget theme</label>
                  <ThemeSelector
                    theme={this.state.theme ? this.state.theme.name : 'default'}
                    onChange={theme => this.onChangeTheme(theme)}
                  />
                </div>
              </div>
              <div className="widget-container">
                {advancedEditorLoading && (
                  <div className="c-loading-spinner -bg" />
                )}
                <ToggleSwitcher
                  elements={['Widget editor', 'Advanced editor']}
                  selected={
                    advancedEditor ? 'Advanced editor' : 'Widget editor'
                  }
                  onChange={newSelected => {
                    const selected = advancedEditor
                      ? 'Advanced editor'
                      : 'Widget editor';
                    if (selected !== newSelected) {
                      this.onToggleAdvancedEditor();
                    }
                  }}
                />
                {!advancedEditor && (
                  <WidgetEditor
                    datasetId={dataset}
                    widgetTitle={title}
                    theme={this.state.theme}
                    onChangeTheme={this.onCustomizeTheme}
                    saveButtonMode="never"
                    embedButtonMode="never"
                    useLayerEditor
                    onChangeWidgetTitle={t => setTitle(t)}
                    provideWidgetConfig={func => {
                      this.getWidgetConfig = func;
                    }}
                    provideLayer={func => {
                      this.getLayer = func;
                    }}
                  />
                )}
                {advancedEditor && (
                  <div className="advanced-editor">
                    <div className="textarea-container">
                      <p>{`Make sure you're using a syntax compatible with Vega ${
                        ENV.VEGA_VERSION.split('.')[0]
                      }. Please remove the "$schema" attribute from the specification.`}</p>
                      <textarea
                        ref={el => {
                          this.advancedEditor = el;
                        }}
                        defaultValue={JSON.stringify(widgetConfig, null, 2)}
                      />
                    </div>
                    <div className="preview">
                      {previewLoading && (
                        <div className="c-loading-spinner -bg" />
                      )}
                      {widgetConfig && widgetConfig.data && (
                        <VegaChart
                          data={widgetConfig}
                          theme={widgetConfig.config || this.state.theme}
                          showLegend
                          reloadOnResize
                          toggleLoading={loading =>
                            this.setState({ previewLoading: loading })
                          }
                          getForceUpdate={func => {
                            this.forceChartUpdate = func;
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <ExtendedHeader
          title={STEPS[currentStep].name}
          subTitle={STEPS[currentStep].description}
        />
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
            additionalContent={
              advancedEditor
                ? 'Make sure you followed the requirements above the editor. If so, please try again later.'
                : 'Please try again later.'
            }
            onClose={() => this.setState({ saveError: false })}
          />
        )}

        {advancedEditor && !advancedEditorWarningAccepted && (
          <Notification
            type="warning"
            content="Once you've created the widget with the advanced editor, you won't be able to use the simple interface."
            dialogButtons
            closeable={false}
            onCancel={() => this.setState({ advancedEditor: false })}
            onContinue={() =>
              this.setState({ advancedEditorWarningAccepted: true })
            }
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
              {currentStep >= 1 && (
                <button
                  type="button"
                  className="c-button -outline -dark-text"
                  onClick={() => setStep(currentStep - 1)}
                >
                  Back
                </button>
              )}
              {(currentStep === 0 || currentStep === 1) && (
                <button
                  type="submit"
                  className="c-button"
                  disabled={
                    (currentStep === 0 && !dataset) ||
                    (currentStep === 1 && !title)
                  }
                  onClick={() => setStep(currentStep + 1)}
                >
                  Continue
                </button>
              )}
              {currentStep === 2 && (
                <button
                  type="submit"
                  className="c-button"
                  onClick={() => this.onClickCreate()}
                  disabled={creating}
                >
                  {creating && (
                    <div className="c-loading-spinner -inline -btn" />
                  )}
                  {!creating && 'Create'}
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
  privateName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  citation: PropTypes.string.isRequired,
  allowDownload: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
  setDataset: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  setPrivateName: PropTypes.func.isRequired,
  setDescription: PropTypes.func.isRequired,
  setCitation: PropTypes.func.isRequired,
  setAllowDownload: PropTypes.func.isRequired,
  queryUrl: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string.isRequired,
  defaultLanguage: PropTypes.string
};

NewWidgetPage.defaultProps = {
  defaultLanguage: null
};

function mapStateToProps(state) {
  return {
    env: state.env,
    currentStep: state.management.step,
    dataset: state.management.widgetCreation.dataset,
    title: state.management.widgetCreation.title,
    privateName: state.management.widgetCreation.privateName,
    description: state.management.widgetCreation.description,
    citation: state.management.widgetCreation.citation,
    allowDownload: state.management.widgetCreation.allowDownload,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setStep: (...params) => dispatch(setStep(...params)),
    setDataset: (...params) => dispatch(setWidgetCreationDataset(...params)),
    setTitle: (...params) => dispatch(setWidgetCreationTitle(...params)),
    setPrivateName: (...params) =>
      dispatch(setWidgetCreationPrivateName(...params)),
    setDescription: (...params) =>
      dispatch(setWidgetCreationDescription(...params)),
    setCitation: (...params) => dispatch(setWidgetCreationCitation(...params)),
    setAllowDownload: (...params) =>
      dispatch(setWidgetCreationAllowDownload(...params)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewWidgetPage);
