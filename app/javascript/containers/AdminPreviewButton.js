import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const consumer = window.ActionCable.createConsumer();

// Not really React way but nothing can be done while the form is not in a component.
function getSiteSettings() {
  // We could use just the selector if naming followed a regular rule.
  const fields = [
    { name: 'color', selector: '#accent-color_id' },
    { name: 'contentWidth', selector: '#content_width' },
    { name: 'contentFont', selector: '#content_font' },
    { name: 'headingFont', selector: '#heading_font' },
    { name: 'coverSize', selector: '#cover_size' },
    { name: 'coverTextAlignment', selector: '#cover_text_alignment' },
    { name: 'headerSeparators', selector: '#header_separators' },
    { name: 'headerBackground', selector: '#header_background' },
    { name: 'headerTransparency', selector: '#header_transparency' },
    { name: 'headerLoginEnabled', selector: '#header_login_enabled' },
    { name: 'footerBackground', selector: '#footer_background' },
    { name: 'footerTextColor', selector: '#footer_text_color' },
    { name: 'footerLinksColor', selector: '#footer-links-color' }
  ];

  const values = fields.reduce((acc, field) => ({
    ...acc,
    [field.name]: document.querySelector(field.selector).value
  }), {});

  const headerCountryColors = Array.from(document.querySelectorAll('.country-colors-container input[type="color"]'))
    .map(countryColor => countryColor.value).join(' ');

  return { ...values, headerCountryColors };
}

export default function AdminPreviewButton({ className, text, host, slug }) {
  useEffect(() => {
    consumer.subscriptions.create('PreviewChannel', {
      connected: () => {},
      disconnected: () => {},
      received: (data) => {
        setPreviewButtonState({ ...previewButtonState, isLoading: false });

        // Open preview page
        window.open(`${host}/admin/sites/${slug}/preview`, '_blank');
      }
    })
    return () => {};
  }, []);
  const [previewButtonState, setPreviewButtonState] = useState({ isLoading: false });

  function compileStyleSheet(_host, _slug) {
    $.get(
      `${_host}/admin/sites/${_slug}/preview/compile`,
      { site_settings: getSiteSettings() },
      () => {
        setPreviewButtonState({ ...previewButtonState, isLoading: true });
      }
    );
  }

  const clickHandler = (isLoading) => {
    if (!isLoading) {
      compileStyleSheet(host, slug);
    }
  };
  const button = (
    <button className={classnames(className)} type="button" onClick={() => clickHandler(null)}>
      {text}
    </button>
  );
  const loadingButton = (
    <button className={classnames(className)} type="button" disabled="disabled">
      <div className="c-loading-spinner -inline" />
    </button>);

  return previewButtonState.isLoading ? loadingButton : button;
}

AdminPreviewButton.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  host: PropTypes.string,
  slug: PropTypes.string
};

AdminPreviewButton.defaultProps = {
  text: '',
  className: '',
  host: 'http://localhost',
  slug: null
};
