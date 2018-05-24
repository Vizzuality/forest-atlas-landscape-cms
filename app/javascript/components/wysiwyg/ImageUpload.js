import React from 'react';
import PropTypes from 'prop-types';

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.file = null;
    this.encodedFile = null;
    this.onSubmit = props.onSubmit;
  }

  imageToBase64(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  }

  generateImage(e) {
    e.preventDefault();
    this.imageToBase64(this.file.files[0]).then((base64) => {
      this.onSubmit({
        image: base64
      });
    });
  }

  render() {
    return (
      <form>
        <input
          type="file"
          name="wysiwyg-file"
          ref={input => (this.file = input)}
          onChange={e => this.generateImage(e)}
        />
      </form>
    );
  }
}

ImageUpload.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default ImageUpload;
