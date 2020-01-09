import React, { Fragment } from 'react';
import classNames from 'classnames';

const DEFAULT_EMPTY_IMAGE = {
  // We default to destroy, as no image is present
  // This will be updated once the image is added
  _destroy: 1,
  attribution_label: '',
  attribution_link: ''
};

class AdminCarousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      main_images: [
        ...gon.global.main_images
          .map(i => ({ ...i, _destroy: 0 })),
        DEFAULT_EMPTY_IMAGE
      ],
      imagePreview: {},
    }

    this.previousPosition = 30;

    this.fileInputs = [];
  }

  readFilePreview(e, index, inputId) {
    const { main_images } = this.state;
    const { user } = window.gon.global;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    return fetch(`/admin/temporary_content_images`, {
      method: 'POST',
      headers: { Authorization: user.token },
      body: formData
    })
    .then(response => response.json())
    .then((response) => {
      const image_url = response.url;
      const patch = [
        ...main_images.map((image, i) => {
          if (i === index) {
            return { ...image, image_url, _destroy: 0 };
          }
          return image;
        }),
        DEFAULT_EMPTY_IMAGE
      ];
      this.setState({ main_images: patch });
    })
    .catch((e) => {
      console.error('Error: We couldn\'t upload the image. Try again');
    });
  }

  fileInput(attributeId, inputId, index, filePath = '', id = '') {
    return (
      <Fragment>
        <input
          ref={input => this.fileInputs[index] = input}
          onChange={e => this.readFilePreview(e, index, inputId)}
          type="file"
          id={`${inputId}-file`}
          accept="image/*"
          datatype="background"
        />
        <input
          type="hidden"
          name={`${attributeId}[image]`}
          id={inputId}
          value={filePath}
        />
        <input
          type="hidden"
          name={`${attributeId}[id]`}
          id={`${inputId}-file`}
          value={id}
        />
      </Fragment>
    )
  }

  toggleDeletion(index) {
    const patch = this.state.main_images.map((image, curr) => {
      if (curr === index) {
        image._destroy = !parseInt(image._destroy) ? '1' : '0';
      }
      return image;
    })
    this.setState({ main_images: patch });
  }

  changeAttribution(index, attribute, value) {
    const patch = this.state.main_images.map((image, curr) => {
      if (curr === index) {
        image[attribute] = value;
      }
      return image;
    })

    this.setState({ main_images: patch });
  }

  coverAttributions(attributeId, attributionLabel, attributionLink, _destroy, attributesOffset, i) {
    return (
      <div className="cover-attribution">
        <input type="hidden" name={`${attributeId}[name]`} value="main_image" />
        <input type="hidden" name={`${attributeId}[position]`} value={attributesOffset} />
        <input type="hidden" name={`${attributeId}[_destroy]`} value={_destroy} />
        <input type="text" value={attributionLabel} onChange={e => this.changeAttribution(i, 'attribution_label', e.target.value)} placeholder="image attribution" name={`${attributeId}[attribution_label]`} />
        <input type="text" value={attributionLink} onChange={e => this.changeAttribution(i, 'attribution_link', e.target.value)} placeholder="attribution link" name={`${attributeId}[attribution_link]`} />
      </div>
    );
  }

  renderInputs(image, i) {
    const { main_images } = this.state;
    const { id, image_url, image_file_name, attribution_label, _destroy, attribution_link, position } = image;
    const imagePosition = position || this.previousPosition + i;

    const INPUT_ID = `main-image-${i}`;
    const ATTRIBUTE_ID = `site[site_settings_attributes][${imagePosition}]`;

    if (image_url || INPUT_ID in this.state.imagePreview) {
      const previewClasses = classNames({
        preview: true,
        '-high': true,
        'deletion': !!parseInt(_destroy)
      })

      const deleteBtnClasses = classNames({
        remove: true,
        restore: !!parseInt(_destroy)
      })

      this.previousPosition = imagePosition;

      return (
        <div key={i}>
          <div className={previewClasses}>
            {image_url && <img src={image_url}  alt={image_file_name} />}
            {INPUT_ID in this.state.imagePreview && <img src={this.state.imagePreview[INPUT_ID]} /> }
          </div>
          <div className="file-input-footer">
            {this.fileInput(ATTRIBUTE_ID, INPUT_ID, i, image_url, id)}
            <div className="restrictions">
              <button type="button" className={deleteBtnClasses} onClick={() => this.toggleDeletion(i)}>
                {!!parseInt(_destroy) ? 'Restore' : 'Remove'}
              </button>
            </div>
            {this.coverAttributions(ATTRIBUTE_ID, attribution_label, attribution_link, _destroy, imagePosition, i)}
          </div>
        </div>
      );
    } else {
      return (
        <div key={i}>
          <div className="placeholder -high">
            <span>Select file</span>
            <label htmlFor={`${INPUT_ID}-file`}>
              Change main image
            </label>
          </div>
          <div className="file-input-footer">
            <div className="restrictions js-restrictions">
              Recommended dimensions: 1280x500<br />
              Max. size: 1MB
            </div>
            {this.fileInput(ATTRIBUTE_ID, INPUT_ID, i, image_url)}
            {this.coverAttributions(ATTRIBUTE_ID, attribution_label, attribution_link, _destroy, imagePosition, i)}
          </div>
        </div>
      );
    }
  }

  render() {
    const { main_images } = this.state;

    return (
      <div className="homepage-cover-container">
        <div className="homepage-cover">
          <h3>Homepage cover image</h3>
          <p>If you'd like, you can select multiple images to create a carousel.</p>
          {main_images.map((image, i) => this.renderInputs(image, i))}
        </div>
      </div>
    )
  }
}

export default AdminCarousel;
