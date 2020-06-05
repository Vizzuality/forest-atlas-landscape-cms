import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WidgetEditor, { getEditorState } from '@widget-editor/widget-editor';

import {
  getFAAdapter,
  getWidgetSchemes,
  getMostAppropriateMetadataLanguage,
} from 'helpers/widget-editor';
import ExtendedHeader from 'components/ExtendedHeader';
import StepsBar from 'components/StepsBar';
import Notification from 'components/Notification';


const STEPS = [
  {
    name: 'Dataset',
    description: 'Pick the dataset you want to use for the widget.'
  },
  {
    name: 'Widget',
    description: 'Set up the widget itself or its metadata.'
  },
];

let FAAdapter;

const NewWidgetPage = ({ datasets, env, defaultLanguage, queryUrl, redirectUrl }) => {
  const [currentStep, setCurrentStep] = useState(0);
  // Whether we're currently saving the widget in the API
  const [saving, setSaving] = useState(false);
  // Error while retrieving the widgetConfig from the widget-editor
  const [widgetConfigError, setWidgetConfigError] = useState(false);
  // Error while saving the widget
  const [saveError, setSaveError] = useState(false);
  // ID of the dataset the user has chosen
  const [dataset, setDataset] = useState(null);
  // Whether we're initialising data for the widget-editor
  const [initializing, setInitializing] = useState(true);
  const [privateName, setPrivateName] = useState('');
  const [citation, setCitation] = useState('');
  const [allowDownload, setAllowDownload] = useState(true);

  const onClickCreate = useCallback(
    () => {
      setSaving(true);

      try {
        const editorPayload = getEditorState().payload;

        const newWidget = {
          name: editorPayload.attributes.name || null,
          description: editorPayload.attributes.description || null,
          widgetConfig: editorPayload.attributes.widgetConfig,
          application: [env.apiApplications],
          published: false,
          default: false,
          dataset,
        };

        const newMetadata = {
          info: {
            privateName,
            citation,
            allowDownload,
          },
          language: 'en', // Widgets metadata doesn't change depending of language
          application: env.apiApplications
        };

        fetch(queryUrl, {
          method: 'POST',
          body: JSON.stringify({
            widget: newWidget,
            metadata: newMetadata
          }),
          credentials: 'include',
          headers: new Headers({
            'content-type': 'application/json'
          })
        })
          .then((res) => {
            if (res.ok) {
              window.location = redirectUrl;
            } else {
              throw new Error(res.statusText);
            }
          })
          .catch(() => {
            setSaveError(true);
            setSaving(false);
          });
      } catch (e) {
        console.error(e);
        setWidgetConfigError(true);
        setSaving(false);
      }
    },
    [
      env,
      queryUrl,
      redirectUrl,
      privateName,
      citation,
      allowDownload,
      setWidgetConfigError,
      setSaving,
    ]
  );

  useEffect(() => {
    if (currentStep === 1 && initializing) {
      let locale = null;
      getMostAppropriateMetadataLanguage(dataset, defaultLanguage)
        .then((language) => {
          locale = language;
        })
        .catch(() => null)
        .then(() => {
        // We configure the widget-editor
        // The important bit here is giving it the locale which has alias info
          FAAdapter = getFAAdapter({ ...env, locale });

          // We render the widget-editor
          setInitializing(false);
        });
    }
  }, [dataset, defaultLanguage, env, initializing, currentStep, setInitializing]);

  return (
    <div>
      <ExtendedHeader
        title={STEPS[currentStep].name}
        subTitle={STEPS[currentStep].description}
      />
      <StepsBar
        steps={STEPS.map(s => s.name)}
        currentStep={currentStep}
        onChangeStep={setCurrentStep}
      />

      {widgetConfigError && (
      <Notification
        type="warning"
        content="Unable to create the widget"
        additionalContent="Make sure the visualization is correctly previewed before submitting the widget."
        onClose={() => setWidgetConfigError(false)}
      />
      )}

      {saveError && (
      <Notification
        type="error"
        content="Unable to create the widget"
        additionalContent="Please try again later."
        onClose={() => setSaveError(false)}
      />
      )}

      {currentStep === 0 && (
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
      )}

      {currentStep === 1 && (
        <div className="l-widget-creation -visualization">
          <div className="wrapper">
            <div className="c-inputs-container">
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

            {initializing && (
              <div className="widget-container">
                <div className="c-loading-spinner -bg" />
              </div>
            )}

            {!initializing && (
              <div className="widget-container">
                <WidgetEditor
                  adapter={FAAdapter}
                  datasetId={dataset}
                  enableSave={false}
                  schemes={getWidgetSchemes()}
                />
              </div>
            )}
          </div>
        </div>
      )}

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
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </button>
            )}
            {currentStep === 0 && (
              <button
                type="submit"
                className="c-button"
                disabled={currentStep === 0 && !dataset}
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Continue
              </button>
            )}
            {currentStep === 1 && (
              <button
                type="submit"
                className="c-button"
                onClick={onClickCreate}
                disabled={saving}
              >
                {saving && <div className="c-loading-spinner -inline -btn" />}
                {!saving && 'Create'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

NewWidgetPage.propTypes = {
  env: PropTypes.object.isRequired,
  datasets: PropTypes.array.isRequired,
  queryUrl: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string.isRequired,
  defaultLanguage: PropTypes.string
};

NewWidgetPage.defaultProps = {
  defaultLanguage: null
};

export default connect(({ env }) => ({ env }))(NewWidgetPage);
