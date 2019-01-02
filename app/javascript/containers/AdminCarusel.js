import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class AdminCarusel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            main_images: [ ...gon.global.main_images.filter(i => i.value && i.value.length > 0), {} ],
        }
        this.inputs = [];
    }

    openFileInput(i) {
        this.inputs[i].click();
    }

    generateHiddenInputs(formData) {
        const { form } = this.props;
        return <input 
            type="file" 
            name={`site[site_settings_attributes][4][image]`} 
            value={formData}
            style={{opacity: 0, filter: 'alpha(opacity=0)', width: 0, overflow: 'hidden' }}
        />
    }   

    renderInputs(image, i) {
        // XXX : warning, if backend changes the attributes for image, this needs to be changed
        // as of now each image gets appended after the 6th attribute
        const attributesOffset = 6;
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
                    <input type="text" placeholder="image attribution" name={`site[site_settings_attributes][${attributesOffset + i}][attribution]`} />
                    <input type="text" placeholder="attribution link" name={`site[site_settings_attributes][${attributesOffset + i}][link]`} />
                </div>
            </div>
        </div>
        )
    }

    render() {
        console.log(this);
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
