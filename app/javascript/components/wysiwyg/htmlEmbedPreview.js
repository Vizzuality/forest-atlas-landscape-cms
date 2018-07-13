import React from 'react';
import PropTypes from 'prop-types';

export default function HtmlEmbedPreview({ readOnly, onChange, item } ) {

  if (readOnly) {
    return <div dangerouslySetInnerHTML={{ __html: item.content }} />;
  }

  return (
    <textarea
      style={{
        width: '100%',
        'min-height': '150px',
        'font-size': '14px',
        border: '2px dashed rgb(197, 197, 197)',
        padding: '13px',
        outline: 'none'
      }}
      onChange={e => onChange({ content: e.target.value })}
    >
      {item.content}
    </textarea>);
}

HtmlEmbedPreview.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};
