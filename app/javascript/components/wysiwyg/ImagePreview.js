import React from 'react';
import PropTypes from 'prop-types';

class ImagePreview extends React.Component {
  constructor(props) {
    super(props);
    this.item = props.item;
    this.content = this.item.content;
    this.readOnly = props.readOnly;
    this.onChange = props.onChange;
  }

  render() {
    const { image, caption } = this.content;
    return (
      <div className="fa-wysiwyg-file__preview">
        {image && image.length ? <img src={image} alt={this.item.id} /> : 'Invalid image'}
        {this.readOnly && caption && <span className="fa-wysiwyg-file__preview--caption">{caption}</span>}
        {!this.readOnly && <textarea className="fa-wysiwyg-file__preview--captionInput" placeholder="image caption here" onChange={e => this.onChange({ content: {
          caption: e.target.value,
          image
        } })}>{caption}</textarea>}
      </div>);
  }

}


ImagePreview.propTypes = {
  item: PropTypes.object.isRequired
};

export default ImagePreview;
