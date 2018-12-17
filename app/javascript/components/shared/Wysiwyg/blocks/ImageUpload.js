import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class ImageUpload extends PureComponent {
  state = {
    image: null,
    caption: null,
    alternativeText: null
  };

  imageToBase64(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  }

  generateImage() {
    this.imageToBase64(this.file.files[0]).then(base64 => {
      this.setState({ image: base64 });
    });
  }

  setImageData() {
    const { onSubmit } = this.props;
    const { image, caption, alternativeText } = this.state;
    onSubmit({ caption, image, alternativeText });
  }

  render() {
    return (
      <form className="fa-wysiwyg-file__form">
        <div className="fa-wysiwyg-file__form--file">
          <input
            type="file"
            name="wysiwyg-file"
            ref={input => (this.file = input)}
            onChange={() => this.generateImage()}
            aria-label="Add image"
          />
        </div>
        <input
          type="text"
          name="wysiwyg-file-caption"
          placeholder="Add caption"
          className="fa-wysiwyg-file__form--caption"
          onChange={({ target }) => this.setState({
            caption: target.value
          })}
          aria-label="Image caption"
        />
        <input
          type="text"
          name="wysiwyg-file-alternative-text"
          placeholder="Add alternative text"
          className="fa-wysiwyg-file__form--caption"
          onChange={({ target }) => this.setState({
            alternativeText: target.value
          })}
          aria-label="Image alternative text"
        />
        <button
          type="button"
          className="fa-wysiwyg-file__form--submit"
          onClick={() => this.setImageData()}
        >
          Done
        </button>
      </form>
    );
  }
}

ImageUpload.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default ImageUpload;
