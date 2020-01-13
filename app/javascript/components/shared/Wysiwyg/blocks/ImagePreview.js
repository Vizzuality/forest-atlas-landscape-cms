import React, { PureComponent } from "react";
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
          <div className="fa-wysiwyg-configuration">
            <header>
              <span>Configuration</span>  
            </header>
            <main>
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
              <label className="no-margin-bottom">
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
            </main>
          </div>
        )}
      </div>
    );
  }
}

ImagePreview.propTypes = {
  item: PropTypes.object.isRequired
};

export default ImagePreview;
