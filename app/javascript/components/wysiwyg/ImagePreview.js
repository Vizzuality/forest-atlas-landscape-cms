import React from 'react';
import PropTypes from 'prop-types';

export default function ImagePreview({ item }) {
  const { content } = item;
  return (
    <div>
      {content && content.image && content.image.length ? <img src={content.image} alt={item.id} /> : 'Invalid image'}
    </div>);
}

ImagePreview.propTypes = {
  item: PropTypes.object.isRequired
};
