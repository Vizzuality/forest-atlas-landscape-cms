import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class ImageUpload extends PureComponent {
  state = {
    image: null,
    caption: null,
    alternativeText: null
  };

  // TODO: endpoint does not exsist yet.. work in progress
  generateImage() {
    const { user, api_url } = window.gon.global;
    const file = this.file.files[0];
    const formData = new FormData();
    formData.append('image', file);
    
    fetch(`localhost:3000/temporary_content_images`, {
      method: 'POST',
      headers: { Authorization: user.token },
      body: formData
    })
    .then(response => response.json())
    .then((response) => {
      console.log('generating image', response);
      this.setState({ image: response.url });
    })
    .catch((e) => {
      // TODO: maybe a better error message?
      console.error('Error', 'We couldn\'t upload the image. Try again');
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
