import React from "react"
import PropTypes from "prop-types"

import classnames from 'classnames';

class CoverPage extends React.Component {
  render() {
    const { site, secondary, usePageTitle } = this.props;

    const { current, page, meta } = site;
    const { pageSize, image, siteTemplateName } = meta;

    const coverBackground = {
      backgroundImage: `url(${image})`
    };

    const ClsMainWrapper = classnames({
      'c-cover': true,
      '-short': (pageSize && pageSize === 'small') || secondary
    });

    let page_title;
    let cover_subtitle;
    let cover_description;
    let atlas_button;
    let atlas_flex_div;
    let logo_3_img_div;
    let hr;
    let cover_title_para;
    let cover_description_para;
    let cover_page_wrapper; 
    let cover_page_wrapper_envelope ;





    if (siteTemplateName != 'INDIA') {

      page_title = <h2 className="cover-title"> {page.content_type == 3 ? current.name : page.name} </h2>;
      cover_subtitle = page.content_type !== 3 && <h2 className="cover-subtitle"> {current.name} </h2>;
    
    } else {
      if (page.content_type == 3) {

        cover_description = <div className="cover-desc-wrapper" > <h2 className="cover-description"> {page.description} </h2> </div>;

        atlas_button = <div className="button_wrapper"> <a href="/atlas" className="home_page_atlas_button"> Launch Atlas </a> </div>;

        atlas_flex_div = <div className="atlas_flex_div"> {atlas_button} </div>;

        logo_3_img_div = <div className="restoration_image_div"> <img className="restoration_image" alt="Logo" src="http://wri-sites.s3.amazonaws.com/ifmt/NationalAtlasPartnerLogo/Atlas/RO_Atlas_white_png.png" /> </div>;

        hr = <hr className="hr-homepage" />;

        cover_title_para = <p className="cover-title-para"> {current.name} </p>;

        cover_description_para = <p className="cover-description-para"> {page.description} </p>;

        cover_page_wrapper = <div className="cover-page-wrapper"> {logo_3_img_div} {hr} {cover_title_para} {cover_description_para} </div>;

        cover_page_wrapper_envelope = <div className="cover_page_wrapper_envelope"> {cover_page_wrapper} </div>

        page_title = <div className="cover-elem-wrapper"> {cover_page_wrapper_envelope} {atlas_flex_div} </div>;

      
      } else {
        cover_subtitle = <h2 className="cover-title-left-other-page"> {page.name} </h2>;
      }
    }

    return (
      <div className={ClsMainWrapper} style={coverBackground}>

        <div className="wrapper">
          {/* content_type 3 === homepage */}
          {page_title}
          {cover_subtitle}
          
          {/* India Template specific changes */}
        </div>

        {image &&
          <div className="cover-attribution">
            {image.attribution_link &&
            <a target="_blank" href={image.instance.attribution_link}>{image.instance.attribution_label}</a>}

            {image.attribution_link && <p>{image.instance.attribution_label}</p>}
          </div>}

      </div>
    );

  }
}

CoverPage.propTypes = {
  site: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.text
  }),
  page: PropTypes.shape({
    name: PropTypes.string
  }),
  image: PropTypes.string,
  siteTitleOnly: PropTypes.bool,
  siteTemplateName: PropTypes.string,
  size: PropTypes.string
};

export default CoverPage
