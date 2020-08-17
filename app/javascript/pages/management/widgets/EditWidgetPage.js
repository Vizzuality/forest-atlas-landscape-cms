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
import Notification from 'components/Notification';

let FAAdapter;

const EditWidgetPage = ({ widget, env, defaultLanguage, queryUrl, redirectUrl }) => {
  const metadata = widget.metadata.length ? widget.metadata[0].attributes : null;
  const infoMetadata = metadata ? metadata.info : {};

  // Whether we're initialising data for the widget-editor
  const [initializing, setInitializing] = useState(true);
  // Whether we're currently saving the widget in the API
  const [saving, setSaving] = useState(false);
  // Error while retrieving the widgetConfig from the widget-editor
  const [widgetConfigError, setWidgetConfigError] = useState(false);
  // Error while saving the widget
  const [saveError, setSaveError] = useState(false);
  const [privateName, setPrivateName] = useState(infoMetadata.privateName || '');
  const [citation, setCitation] = useState(infoMetadata.citation || '');
  const [allowDownload, setAllowDownload] = useState(
    infoMetadata.allowDownload !== undefined && infoMetadata.allowDownload !== null
      ? infoMetadata.allowDownload
      : false
  );

  const onClickCancel = useCallback(() => window.history.back(), []);

  const onClickUpdate = useCallback(
    () => {
      setSaving(true);

      try {
        const editorPayload = getEditorState().payload;

        const newWidget = {
          name: editorPayload.name || null,
          description: editorPayload.description || null,
          widgetConfig: editorPayload.widgetConfig,
          application: [env.apiApplications],
          published: false,
          default: false,
          dataset: widget.dataset
        };

        const newMetadata = {
          info: {
            privateName,
            citation,
            allowDownload,
            caption: editorPayload.metadata.caption || null,
          },
          id: widget.id,
          language: 'en', // Widgets metadata doesn't change depending of language
          application: env.apiApplications
        };

        fetch(queryUrl, {
          method: 'PUT',
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
      widget,
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
    let locale = null;
    getMostAppropriateMetadataLanguage(widget.dataset, defaultLanguage)
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
  }, [widget, defaultLanguage, env, setInitializing]);

  return (
    <div>
      <ExtendedHeader
        title="Widget edition"
        subTitle="You can modify the widget itself or its metadata."
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
          content="Unable to update the widget"
          additionalContent="Please try again later."
          onClose={() => setSaveError(false)}
        />
      )}

      {initializing && (
        <div className="l-widget-creation -visualization">
          <div className="wrapper">
            <div className="c-loading-spinner -bg" />
          </div>
        </div>
      )}

      {!initializing && (
        <div className="l-widget-creation -dataset">
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

            <div className="widget-container">
              <WidgetEditor
                adapter={FAAdapter}
                datasetId={widget.dataset}
                {...(widget ? { widgetId: widget.id } : {})}
                enableSave={false}
                schemes={getWidgetSchemes()}
              />
            </div>
          </div>
        </div>
      )}

      <div className="c-action-bar">
        <div className="wrapper">
          <button
            type="button"
            className="c-button -outline -dark-text"
            onClick={onClickCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="c-button"
            onClick={onClickUpdate}
            disabled={saving}
          >
            {saving && <div className="c-loading-spinner -inline -btn" />}
            {!saving && 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

EditWidgetPage.propTypes = {
  /**
   * Widget to edit
   */
  widget: PropTypes.object,
  env: PropTypes.object.isRequired,
  queryUrl: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string.isRequired,
  defaultLanguage: PropTypes.string
};

EditWidgetPage.defaultProps = {
  widget: null,
  defaultLanguage: null
};

export default connect(({ env }) => ({ env }))(EditWidgetPage);
