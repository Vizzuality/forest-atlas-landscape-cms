import React from "react";
import PropTypes from "prop-types";

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.file = null;
    this.caption = null;
    this.encodedFile = null;
    this.onSubmit = props.onSubmit;

    this.state = {
      image: null,
      caption: null
    };
  }

  imageToBase64(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  }

  generateImage(e) {
    this.imageToBase64(this.file.files[0]).then(base64 => {
      this.setState({ image: base64 });
    });
  }

  setImageCaption(e) {
    this.setState({
      caption: this.caption.value
    });
  }

  setImageData(e) {
    e.preventDefault();
    const { image, caption } = this.state;
    this.onSubmit({ caption, image });
  }

  render() {
    return (
      <form className="fa-wysiwyg-file__form">
        <div className="fa-wysiwyg-file__form--file">
          <input
            type="file"
            name="wysiwyg-file"
            ref={input => (this.file = input)}
            onChange={e => this.generateImage(e)}
            aria-label="Add image"
          />
        </div>
        <input
          type="text"
          name="wysiwyg-file-caption"
          placeholder="Add caption/alternative text"
          className="fa-wysiwyg-file__form--caption"
          ref={caption => (this.caption = caption)}
          onChange={e => this.setImageCaption(e)}
          aria-label="Image caption/alternative text"
        />
        <button
          role="button"
          className="fa-wysiwyg-file__form--submit"
          onClick={e => this.setImageData(e)}
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
