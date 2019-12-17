import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import queryString from 'query-string';

const CONSUMER = window.ActionCable.createConsumer();

const SETTINGS_DICT = {
  color: { selector: '#accent-color_id', multiple: false },
  content_width: { selector: '#content_width', multiple: false },
  content_font: { selector: '#content_font', multiple: false },
  heading_font: { selector: '#heading_font', multiple: false },
  cover_size: { selector: '#cover_size', multiple: false },
  cover_text_alignment: { selector: '#cover_text_alignment', multiple: false },
  header_separators: { selector: '#header_separators', multiple: false },
  header_background: { selector: '#header_background', multiple: false },
  header_transparency: { selector: '#header_transparency', multiple: false },
  header_login_enabled: { selector: '#header_login_enabled', multiple: false },
  // NOTE: the country colors inputs are re-rendered every time there's a change (whether it's a
  // change of value, inputs are added or inputs are removed) by a Backbone view.
  // That means that the "change" event listeners we'll attach to the inputs won't ever be fired.
  // Nevertheless, we still need this object to be defined so the values can be serialised and sent
  // to the back-end.
  'header-country-colours': {
    selector: '.js-header-country-colours input[type="text"]',
    multiple: true
  },
  footer_background: { selector: '#footer_background', multiple: false },
  footer_text_color: { selector: '#footer_text_color', multiple: false },
  footer_links_color: { selector: '#footer-links-color', multiple: false }
};

const COUNTRY_COLORS_CONTAINER_SELECTOR = '.js-header-country-colours';

const getSettingsValue = () => {
  return Object.keys(SETTINGS_DICT).reduce((res, setting) => {
    const element = SETTINGS_DICT[setting].multiple
      ? document.querySelectorAll(SETTINGS_DICT[setting].selector)
      : document.querySelector(SETTINGS_DICT[setting].selector);

    if (!element) {
      return res;
    }

    return {
      ...res,
      [setting]: SETTINGS_DICT[setting].multiple
        ? [...element].map(({ value }) => value).join(' ')
        : element.value
    };
  }, {});
};

const setSettingsListener = listener => {
  Object.keys(SETTINGS_DICT).forEach(setting => {
    const selector = SETTINGS_DICT[setting].selector;
    const isMulti = SETTINGS_DICT[setting].multiple;

    if (!isMulti) {
      const element = document.querySelector(selector);
      element.addEventListener('change', listener);
    } else {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.addEventListener('change', listener);
      });
    }
  });
};

const removeSettingsListener = listener => {
  Object.keys(SETTINGS_DICT).forEach(setting => {
    const selector = SETTINGS_DICT[setting].selector;
    const isMulti = SETTINGS_DICT[setting].multiple;

    if (!isMulti) {
      const element = document.querySelector(selector);
      element.removeEventListener('change', listener);
    } else {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.removeEventListener('change', listener);
      });
    }
  });
};

export default function AdminPreviewButton({ className, slug }) {
  // State machine without constrained transitions
  // - dirty: the stylesheet needs to be re-generated
  // - loading: the stylesheet is being generated
  // - finished: the stylesheet has been generated
  const [state, setState] = useState('dirty');
  const [previewUrl, setPreviewUrl] = useState(null);
  const setDirtyState = useCallback(() => {
    setState('dirty');
    setPreviewUrl(null);
  }, [setState, setPreviewUrl]);
  const setLoadingState = useCallback(() => setState('loading'), [setState]);
  const setFinishedState = useCallback(
    url => {
      setState('finished');
      setPreviewUrl(url);
    },
    [setState, setPreviewUrl]
  );

  const onReceiveData = data => {
    const siteSettings = JSON.parse(data.site_settings);
    const host = `${window.location.origin}/admin/sites/${slug}/preview`;
    const queryParams = {
      'header-country-colours': siteSettings['header-country-colours'].split(
        ' '
      ),
      header_login_enabled: siteSettings.header_login_enabled
    };
    const url = `${host}?${queryString.stringify(queryParams, {
      arrayFormat: 'bracket'
    })}`;

    setFinishedState(url);
  };

  const onClickButton = useCallback(() => {
    $.get(
      `${window.location.origin}/admin/sites/${slug}/preview/compile`,
      { site_settings: getSettingsValue() },
      () => setLoadingState()
    );
  }, [setLoadingState]);

  // Set the listeners to switch to the dirty state
  useEffect(() => {
    setSettingsListener(setDirtyState);

    return () => {
      removeSettingsListener(setDirtyState);
    };
  }, [setDirtyState]);

  // NOTE: the country colors inputs are re-rendered every time there's a change (whether it's a
  // change of value, inputs are added or inputs are removed) by a Backbone view.
  // Since React can't re-attach the event listeners to the inputs, we listen to DOM tree changes
  // instead.
  useEffect(() => {
    const observer = new MutationObserver(setDirtyState);
    observer.observe(
      document.querySelector(COUNTRY_COLORS_CONTAINER_SELECTOR),
      {
        childList: true,
        subtree: true
      }
    );

    return () => {
      observer.disconnect();
    };
  }, [setDirtyState]);

  // Create the websocket connection
  useEffect(() => {
    CONSUMER.subscriptions.create('PreviewChannel', {
      connected: () => {},
      disconnected: () => {},
      received: onReceiveData
    });

    return () => {};
  }, []);

  if (state === 'finished') {
    return (
      <a href={previewUrl} target="_blank" className={classnames(className)}>
        See preview
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classnames(className, { '-loading': state === 'loading' })}
      onClick={onClickButton}
      disabled={state === 'loading'}
    >
      {state === 'dirty' && 'Update preview'}
      {state === 'loading' && (
        <div className="c-loading-spinner -inline -small" />
      )}
    </button>
  );
}

AdminPreviewButton.propTypes = {
  className: PropTypes.string,
  slug: PropTypes.string
};

AdminPreviewButton.defaultProps = {
  className: '',
  slug: null
};
