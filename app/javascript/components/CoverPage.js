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
    let cover_description_wrapper;
    let cover_description;
    let atlas_button;

    if(siteTemplateName != 'INDIA'){
      page_title = <h2 className="cover-title"> {page.content_type == 3 ? current.name : page.name} </h2>;
      cover_subtitle = page.content_type !== 3 && <h2 className="cover-subtitle">{current.name}</h2>;
    }else{
      if(page.content_type == 3){
        page_title = <h2 className="cover-title-left">{current.name} </h2>;
        cover_description = <div className="cover-desc-wrapper" ><h2 className="cover-description">{page.description}</h2></div>;
        atlas_button = <div class="button_wrapper" height="0px"> <a href="/atlas" className="home_page_atlas_button">Launch Atlas</a> </div>;

        cover_description_wrapper = <div className="cover-elem-wrapper" >{cover_description}{atlas_button}</div>;
      }else{
        cover_subtitle = <h2 className="cover-title-left-other-page">{page.name}</h2>;
      }
    }

    return (
      <div className={ClsMainWrapper} style={coverBackground}>

        <div className="wrapper">
          {/* content_type 3 === homepage */}
          {page_title}
          {cover_subtitle}
          
          {/* India Template specific changes */}
          {cover_description_wrapper}
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
