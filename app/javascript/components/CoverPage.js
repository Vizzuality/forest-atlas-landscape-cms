import React from "react"
import PropTypes from "prop-types"

import classnames from 'classnames';

class CoverPage extends React.Component {
  render () {
    const { site, secondary, usePageTitle } = this.props;

    const { current, page, meta } = site;
    const { pageSize, image } = meta;

    const coverBackground = {
      backgroundImage: `url(${image})`
    };

    const ClsMainWrapper = classnames({
      'c-cover': true,
      '-short': (pageSize && pageSize === 'small') || secondary
    });

    return (
      <div className={ClsMainWrapper} style={coverBackground}>

        <div className="wrapper">
          <h2 className="cover-title">{usePageTitle ? page.name : current.name}</h2>
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
    name: PropTypes.string
  }),
  page: PropTypes.shape({
    name: PropTypes.string
  }),
  image: PropTypes.string,
  siteTitleOnly: PropTypes.bool,
  size: PropTypes.string
};

export default CoverPage
