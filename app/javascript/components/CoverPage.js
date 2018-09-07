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

    if (siteTemplateName != 'INDIA') {

      page_title = <h2 className="cover-title"> {page.content_type == 3 ? current.name : page.name} </h2>;
      cover_subtitle = page.content_type !== 3 && <h2 className="cover-subtitle"> {current.name} </h2>;
    
    } else {
      if (page.content_type == 3) {
        page_title = (
          <div className="cover-elem-wrapper">
            <div className="cover_page_wrapper_envelope">
              <div className="cover-page-wrapper"> 
                <div className="restoration_image_div"> 
                  <img className="restoration_image" alt="Logo" src="http://wri-sites.s3.amazonaws.com/ifmt/NationalAtlasPartnerLogo/Atlas/RO_Atlas_white_png.png" /> 
                </div> 
                
                <div className="hr_div"> <hr className="hr-homepage" /> </div>
                <div className="atlas_flex_div">
                  <div className="button_wrapper"> 
                    <a href="/atlas" className="home_page_atlas_button"> Launch Atlas </a> 
                  </div>
                </div>         
                
                <p className="cover-title-para"> {current.name} </p>
                <p className="cover-description-para"> {page.description} </p>
              </div>
            </div>
          </div>
        );
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
