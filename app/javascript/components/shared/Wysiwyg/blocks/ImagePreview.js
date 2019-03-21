import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";

class ImagePreview extends PureComponent {
  render() {
    const { onChange, readOnly, item } = this.props;
    const { image, caption, alternativeText } = item.content;
    return (
      <div className="fa-wysiwyg-file__preview">
        {image && image.length ? (
          <img src={image} alt={alternativeText || caption || ''} />
        ) : (
          "Invalid image"
        )}
        {readOnly && caption && (
          <span className="fa-wysiwyg-file__preview--caption">{caption}</span>
        )}
        {!readOnly && (
          <Fragment>
            <label>
              Caption
              <textarea
                className="fa-wysiwyg-file__preview--captionInput"
                placeholder="Add caption"
                defaultValue={caption}
                onChange={e =>
                  onChange({
                    content: {
                      alternativeText,
                      caption: e.target.value,
                      image
                    }
                  })
                }
              />
            </label>
            <label>
              Alternative text
              <textarea
                className="fa-wysiwyg-file__preview--captionInput"
                placeholder="Add alternative text"
                defaultValue={alternativeText}
                onChange={e =>
                  onChange({
                    content: {
                      alternativeText: e.target.value,
                      caption,
                      image
                    }
                  })
                }
              />
            </label>
          </Fragment>
        )}
      </div>
    );
  }
}

ImagePreview.propTypes = {
  item: PropTypes.object.isRequired
};

export default ImagePreview;
