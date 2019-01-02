import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class AdminCarusel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            main_images: [ ...gon.global.main_images.filter(i => i.image_file_name && i.image_file_name.length > 0), { } ],
        }
        this.inputs = [];
    }

    openFileInput(i) {
        this.inputs[i].click();
    }

    renderInputs(image, i) {
        // XXX : warning, if backend changes the attributes for image, this needs to be changed
        // as of now each image gets appended after the 6th attribute
        const attributesOffset = 6;

        const { image_file_name, id, attribution_label, attribution_link } = image;

        if (image_file_name) {
            return (
                <div key={i}>
                    <div className="preview -high">
                        <img src={`/system/site_settings/images/000/000/0${id}/original/${image_file_name}`}  alt={image_file_name} />
                    </div>
                    <div className="file-input-footer">
                        <button>Remove</button>
                        <input 
                            ref={input => this.inputs.push(input)} 
                            type="file" 
                            name={`site[site_settings_attributes][${attributesOffset + i}][image]`} 
                            accept="image/*"
                            data-type="background"
                        />
                        <input type="hidden" name={`site[site_settings_attributes][${attributesOffset + i}][name]`} value="main_image" />
                        <input type="hidden" name={`site[site_settings_attributes][${attributesOffset + i}][position]`} value={attributesOffset + i} />
                        <input type="text" value={attribution_label} placeholder="image attribution" name={`site[site_settings_attributes][${attributesOffset + i}][attribution_label]`} />
                        <input type="text" value={attribution_link} placeholder="attribution link" name={`site[site_settings_attributes][${attributesOffset + i}][attribution_link]`} />
                    </div>
                </div>
            )
        } else {
            return (
            <div key={i}>
                <div className="placeholder -high" onClick={() => this.openFileInput(i) }>
                    <span>Select file</span>
                </div>

                <div className="file-input-footer">
                    <div className="restrictions js-restrictions">
                        Recommended dimensions: 1280x500<br />
                        Max. size: 1MB
                    </div>
                    <input 
                        ref={input => this.inputs.push(input)} 
                        type="file" 
                        name={`site[site_settings_attributes][${attributesOffset + i}][image]`} 
                        accept="image/*"
                        data-type="background"
                    />
                    <div className="cover-attribution">
                        <input type="hidden" name={`site[site_settings_attributes][${attributesOffset + i}][name]`} value="main_image" />
                        <input type="hidden" name={`site[site_settings_attributes][${attributesOffset + i}][position]`} value={attributesOffset + i} />
                        <input type="text" placeholder="image attribution" name={`site[site_settings_attributes][${attributesOffset + i}][attribution_label]`} />
                        <input type="text" placeholder="attribution link" name={`site[site_settings_attributes][${attributesOffset + i}][attribution_link]`} />
                    </div>
                </div>
            </div>
            )
        }
    }

    render() {
        return (
            <div className="homepage-cover-container">
                <div className="homepage-cover">
                    <h3>Homepage cover image</h3>
                    <p>You can select multiple images to make an carusel</p>
                    {this.state.main_images.map((image, i) => this.renderInputs(image, i))}
                </div>
            </div>
        )
    }

}

export default AdminCarusel;
