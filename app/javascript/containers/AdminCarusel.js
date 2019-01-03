import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class AdminCarusel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            main_images: [ 
                ...gon.global.main_images
                    .filter(i => i.image_file_name && i.image_file_name.length > 0)
                    .map(i => { i._destroy = 0; return i; }), 
                { } 
            ],
        }

        this.fileInputs = [];
    }

    componentDidMount() {
        console.log(this);
    }

    fileInput(attributeId) {
        return (
        <input 
            ref={input => this.fileInputs.push(input)} 
            type="file" 
            name={`${attributeId}[image]`} 
            accept="image/*"
            data-type="background"
        />
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
        )
    }

    renderInputs(image, i) {
        // XXX : warning, if backend changes the attributes for image, this needs to be changed
        // as of now each image gets appended after the number bellow
        const attributesOffset = 30;

        const { image_file_name, id, attribution_label, _destroy, attribution_link } = image;

        const INPUT_ID = `main-image-${i}`;
        const ATTRIBUTE_ID = `site[site_settings_attributes][${attributesOffset + i}]`;

        if (image_file_name) {
            const previewClasses = classNames({
                preview: true, 
                '-high': true,
                'deletion': !!parseInt(_destroy)
            })

            const deleteBtnClasses = classNames({
                remove: true,
                restore: !!parseInt(_destroy)
            })

            return (
                <div key={i}>
                    <div className={previewClasses}>
                        <img src={`/system/site_settings/images/000/000/0${id}/original/${image_file_name}`}  alt={image_file_name} />
                    </div>
                    <div className="file-input-footer">
                        {this.fileInput(ATTRIBUTE_ID)}
                        <div className="restrictions">
                            <button type="button" className={deleteBtnClasses} onClick={() => this.toggleDeletion(i)}>{!!parseInt(_destroy) ? 'Restore' : 'Remove'}</button>
                        </div>
                        {this.coverAttributions(ATTRIBUTE_ID, attribution_label, attribution_link, _destroy, attributesOffset + i, i)}
                    </div>
                </div>
            )
        } else {
            return (
            <div key={i}>
                <div className="placeholder -high">
                    <span>Select file</span>
                    <label htmlFor={INPUT_ID} tabIndex="0">Change main image</label>
                </div>

                <div className="file-input-footer">
                    <div className="restrictions js-restrictions">
                        Recommended dimensions: 1280x500<br />
                        Max. size: 1MB
                    </div>
                    {this.fileInput(ATTRIBUTE_ID)}
                    {this.coverAttributions(ATTRIBUTE_ID, attribution_label, attribution_link, _destroy, attributesOffset + i, i)}
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
