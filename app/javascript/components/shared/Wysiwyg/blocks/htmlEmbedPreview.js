import React from 'react';
import PropTypes from 'prop-types';

export default function HtmlEmbedPreview({ readOnly, onChange, item } ) {

  if (readOnly) {
    return (<div
      style={{
        display: 'block',
        width: '100%',
        fontSize: '13px'
      }}
      dangerouslySetInnerHTML={{ __html: item.content }}
    />);
  }

  return (
    <textarea
      style={{
        width: '100%',
        minHeight: '150px',
        fontSize: '14px',
        border: '2px dashed rgb(197, 197, 197)',
        padding: '13px',
        outline: 'none'
      }}
      defaultValue={item.content}
      onChange={e => onChange({ content: e.target.value })}
    />
  );
}

HtmlEmbedPreview.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};
