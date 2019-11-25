import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const consumer = window.ActionCable.createConsumer();

// Not really React way but nothing can be done while the form is not in a component.
function getSiteSettings() {
  // We could use just the selector if naming followed a regular rule.
  const fields = [
    { name: 'color', selector: '#accent-color_id' },
    { name: 'content_width', selector: '#content_width' },
    { name: 'content_font', selector: '#content_font' },
    { name: 'heading_font', selector: '#heading_font' },
    { name: 'cover_size', selector: '#cover_size' },
    { name: 'cover_text_alignment', selector: '#cover_text_alignment' },
    { name: 'header_separators', selector: '#header_separators' },
    { name: 'header_background', selector: '#header_background' },
    { name: 'header_transparency', selector: '#header_transparency' },
    { name: 'header_login_enabled', selector: '#header_login_enabled' },
    { name: 'footer_background', selector: '#footer_background' },
    { name: 'footer_text_color', selector: '#footer_text_color' },
    { name: 'footer_links_color', selector: '#footer-links-color' }
  ];

  const values = fields.reduce((acc, field) => ({
    ...acc,
    [field.name]: document.querySelector(field.selector).value
  }), {});

  const headerCountryColors = Array.from(document.querySelectorAll('.country-colors-container input[type="color"]'))
    .map(countryColor => countryColor.value).join(' ');

  return { ...values, 'header-country-colours': headerCountryColors };
}

export default function AdminPreviewButton({ className, text, slug }) {
  useEffect(() => {
    consumer.subscriptions.create('PreviewChannel', {
      connected: () => {},
      disconnected: () => {},
      received: () => {
        setPreviewButtonState({ ...previewButtonState, isLoading: false });

        // Open preview page
        window.open(`${window.location.origin}/admin/sites/${slug}/preview`, '_blank');
      }
    });

    return () => {};
  }, []);
  const [previewButtonState, setPreviewButtonState] = useState({ isLoading: false });

  function compileStyleSheet() {
    $.get(
      `${window.location.origin}/admin/sites/${slug}/preview/compile`,
      { site_settings: getSiteSettings() },
      () => {
        setPreviewButtonState({ ...previewButtonState, isLoading: true });
      }
    );
  }

  const clickHandler = (isLoading) => {
    if (!isLoading) {
      compileStyleSheet();
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
  slug: PropTypes.string
};

AdminPreviewButton.defaultProps = {
  text: '',
  className: '',
  slug: null
};
