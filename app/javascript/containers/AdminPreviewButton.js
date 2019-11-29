import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import queryString from 'query-string';

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    consumer.subscriptions.create('PreviewChannel', {
      connected: () => {},
      disconnected: () => {},
      received: (data) => {
        const siteSettings = JSON.parse(data.site_settings);
        const host = `${window.location.origin}/admin/sites/${slug}/preview`;
        const queryParams = {
          'header-country-colours': siteSettings['header-country-colours'].split(' '),
          header_login_enabled: siteSettings.header_login_enabled
        };
        const url = `${host}?${queryString.stringify(queryParams, {arrayFormat: 'bracket'})}`;

        setIsLoading(false);

        // Open preview page
        window.open(url, '_blank');
      }
    });

    return () => {};
  }, []);

  const compileStyleSheet = () => {
    $.get(
      `${window.location.origin}/admin/sites/${slug}/preview/compile`,
      { site_settings: getSiteSettings() },
      () => setIsLoading(true),
    );
  };

  const onClickButton = useCallback(() => {
    if (!isLoading) {
      compileStyleSheet();
    }
  }, [isLoading]);

  return (
    <button
      type="button"
      className={classnames(className)}
      onClick={onClickButton}
      disabled={isLoading}
    >
      {isLoading ? <div className="c-loading-spinner -inline -small" /> : text}
    </button>
  );
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
